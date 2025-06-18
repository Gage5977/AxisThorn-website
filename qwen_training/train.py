#!/usr/bin/env python3
"""
Qwen Fine-tuning Script with LoRA

A comprehensive training script for fine-tuning Qwen models using 
Parameter Efficient Fine-Tuning (PEFT) with LoRA adapters.
"""

import argparse
import json
import logging
import os
import sys
from dataclasses import dataclass
from typing import Dict, List, Optional

import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    DataCollatorForLanguageModeling,
    Trainer,
    TrainingArguments,
    set_seed,
)
from peft import (
    LoraConfig,
    TaskType,
    get_peft_model,
    prepare_model_for_kbit_training,
)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Fine-tune Qwen models with LoRA adapters"
    )
    
    # Model arguments
    parser.add_argument(
        "--model_name_or_path",
        type=str,
        default="Qwen/Qwen1.5-1.8B",
        help="Path to pretrained model or model identifier"
    )
    parser.add_argument(
        "--trust_remote_code",
        action="store_true",
        default=True,
        help="Trust remote code when loading model"
    )
    
    # Data arguments
    parser.add_argument(
        "--train_file",
        type=str,
        required=True,
        help="Path to training data file (JSONL format)"
    )
    parser.add_argument(
        "--validation_file",
        type=str,
        help="Path to validation data file (JSONL format)"
    )
    parser.add_argument(
        "--max_seq_length",
        type=int,
        default=2048,
        help="Maximum sequence length"
    )
    
    # Training arguments
    parser.add_argument(
        "--output_dir",
        type=str,
        default="./outputs",
        help="Directory to save model and training outputs"
    )
    parser.add_argument(
        "--per_device_train_batch_size",
        type=int,
        default=1,
        help="Batch size per device during training"
    )
    parser.add_argument(
        "--per_device_eval_batch_size",
        type=int,
        default=1,
        help="Batch size per device during evaluation"
    )
    parser.add_argument(
        "--gradient_accumulation_steps",
        type=int,
        default=8,
        help="Number of updates steps to accumulate gradients"
    )
    parser.add_argument(
        "--num_train_epochs",
        type=int,
        default=3,
        help="Total number of training epochs"
    )
    parser.add_argument(
        "--learning_rate",
        type=float,
        default=2e-4,
        help="Learning rate"
    )
    parser.add_argument(
        "--warmup_ratio",
        type=float,
        default=0.03,
        help="Warmup ratio for learning rate scheduler"
    )
    parser.add_argument(
        "--weight_decay",
        type=float,
        default=0.0,
        help="Weight decay coefficient"
    )
    parser.add_argument(
        "--logging_steps",
        type=int,
        default=10,
        help="Log every X updates steps"
    )
    parser.add_argument(
        "--save_steps",
        type=int,
        default=500,
        help="Save checkpoint every X updates steps"
    )
    parser.add_argument(
        "--eval_steps",
        type=int,
        default=500,
        help="Evaluate every X updates steps"
    )
    parser.add_argument(
        "--save_total_limit",
        type=int,
        default=3,
        help="Maximum number of checkpoints to keep"
    )
    
    # LoRA arguments
    parser.add_argument(
        "--lora_r",
        type=int,
        default=8,
        help="LoRA rank"
    )
    parser.add_argument(
        "--lora_alpha",
        type=int,
        default=32,
        help="LoRA alpha scaling parameter"
    )
    parser.add_argument(
        "--lora_dropout",
        type=float,
        default=0.05,
        help="LoRA dropout rate"
    )
    parser.add_argument(
        "--lora_target_modules",
        type=str,
        nargs="+",
        default=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        help="Target modules for LoRA"
    )
    
    # Hardware arguments
    parser.add_argument(
        "--cpu_only",
        action="store_true",
        help="Force CPU-only training"
    )
    parser.add_argument(
        "--fp16",
        action="store_true",
        help="Use fp16 mixed precision training"
    )
    parser.add_argument(
        "--bf16",
        action="store_true",
        help="Use bf16 mixed precision training"
    )
    parser.add_argument(
        "--gradient_checkpointing",
        action="store_true",
        help="Use gradient checkpointing to save memory"
    )
    
    # Other arguments
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for reproducibility"
    )
    parser.add_argument(
        "--resume_from_checkpoint",
        type=str,
        help="Path to checkpoint to resume training from"
    )
    
    return parser.parse_args()


@dataclass
class TrainingDataset:
    """Custom dataset class for training data."""
    
    def __init__(self, file_path: str, tokenizer, max_length: int = 2048):
        self.file_path = file_path
        self.tokenizer = tokenizer
        self.max_length = max_length
        
        logger.info(f"Loading dataset from {file_path}")
        
        # Load and process dataset
        raw_dataset = load_dataset("json", data_files=file_path, split="train")
        self.dataset = raw_dataset.map(
            self._tokenize_function,
            batched=False,
            remove_columns=raw_dataset.column_names,
            desc="Tokenizing dataset"
        )
        
        logger.info(f"Loaded {len(self.dataset)} training samples")
    
    def _tokenize_function(self, example: Dict[str, str]) -> Dict[str, torch.Tensor]:
        """Tokenize a single example."""
        prompt = example.get("prompt", "")
        response = example.get("response", "")
        
        # Combine prompt and response
        full_text = prompt + response
        
        # Tokenize
        tokenized = self.tokenizer(
            full_text,
            truncation=True,
            max_length=self.max_length,
            padding="max_length",
            return_tensors="pt",
        )
        
        input_ids = tokenized["input_ids"].squeeze()
        attention_mask = tokenized["attention_mask"].squeeze()
        
        return {
            "input_ids": input_ids,
            "labels": input_ids.clone(),  # For causal LM
            "attention_mask": attention_mask,
        }
    
    def __len__(self):
        return len(self.dataset)
    
    def __getitem__(self, idx):
        return self.dataset[idx]


def setup_model_and_tokenizer(args):
    """Load and setup model and tokenizer."""
    logger.info(f"Loading tokenizer from {args.model_name_or_path}")
    
    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        args.model_name_or_path,
        trust_remote_code=args.trust_remote_code,
        padding_side="left"
    )
    
    # Add special tokens if needed
    if tokenizer.pad_token is None:
        tokenizer.add_special_tokens({"pad_token": "<|extra_pad|>"})
    
    logger.info(f"Loading model from {args.model_name_or_path}")
    
    # Determine device and dtype
    device_map = "cpu" if args.cpu_only else "auto"
    torch_dtype = torch.float32 if args.cpu_only else torch.float16
    
    if args.bf16 and not args.cpu_only:
        torch_dtype = torch.bfloat16
    
    # Load model
    model = AutoModelForCausalLM.from_pretrained(
        args.model_name_or_path,
        device_map=device_map,
        torch_dtype=torch_dtype,
        trust_remote_code=args.trust_remote_code,
        load_in_8bit=not args.cpu_only,  # Use 8-bit when on GPU
    )
    
    # Resize token embeddings if tokenizer was modified
    if len(tokenizer) > model.config.vocab_size:
        model.resize_token_embeddings(len(tokenizer))
    
    # Prepare model for training
    if not args.cpu_only:
        model = prepare_model_for_kbit_training(model)
    
    return model, tokenizer


def setup_lora(model, args):
    """Setup LoRA configuration and apply to model."""
    logger.info("Setting up LoRA configuration")
    
    lora_config = LoraConfig(
        r=args.lora_r,
        lora_alpha=args.lora_alpha,
        target_modules=args.lora_target_modules,
        lora_dropout=args.lora_dropout,
        bias="none",
        task_type=TaskType.CAUSAL_LM,
    )
    
    model = get_peft_model(model, lora_config)
    
    # Print trainable parameters
    model.print_trainable_parameters()
    
    return model


def create_trainer(model, tokenizer, train_dataset, eval_dataset, args):
    """Create and configure the trainer."""
    
    # Data collator
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False,  # We're doing causal LM, not masked LM
    )
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        overwrite_output_dir=True,
        per_device_train_batch_size=args.per_device_train_batch_size,
        per_device_eval_batch_size=args.per_device_eval_batch_size,
        gradient_accumulation_steps=args.gradient_accumulation_steps,
        num_train_epochs=args.num_train_epochs,
        learning_rate=args.learning_rate,
        warmup_ratio=args.warmup_ratio,
        weight_decay=args.weight_decay,
        logging_steps=args.logging_steps,
        save_steps=args.save_steps,
        eval_steps=args.eval_steps if eval_dataset else None,
        evaluation_strategy="steps" if eval_dataset else "no",
        save_total_limit=args.save_total_limit,
        fp16=args.fp16 and not args.cpu_only,
        bf16=args.bf16 and not args.cpu_only,
        gradient_checkpointing=args.gradient_checkpointing,
        dataloader_drop_last=True,
        report_to="none",  # Disable wandb/tensorboard
        seed=args.seed,
    )
    
    # Create trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        data_collator=data_collator,
    )
    
    return trainer


def main():
    """Main training function."""
    args = parse_arguments()
    
    # Set seed for reproducibility
    set_seed(args.seed)
    
    # Create output directory
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Save training arguments
    with open(os.path.join(args.output_dir, "training_args.json"), "w") as f:
        json.dump(vars(args), f, indent=2)
    
    try:
        # Setup model and tokenizer
        model, tokenizer = setup_model_and_tokenizer(args)
        
        # Setup LoRA
        model = setup_lora(model, args)
        
        # Load datasets
        train_dataset = TrainingDataset(
            args.train_file, 
            tokenizer, 
            args.max_seq_length
        )
        
        eval_dataset = None
        if args.validation_file:
            eval_dataset = TrainingDataset(
                args.validation_file,
                tokenizer,
                args.max_seq_length
            )
        
        # Create trainer
        trainer = create_trainer(
            model, tokenizer, train_dataset, eval_dataset, args
        )
        
        # Start training
        logger.info("Starting training...")
        
        if args.resume_from_checkpoint:
            trainer.train(resume_from_checkpoint=args.resume_from_checkpoint)
        else:
            trainer.train()
        
        # Save final model
        logger.info("Training completed. Saving final model...")
        trainer.save_model()
        tokenizer.save_pretrained(args.output_dir)
        
        logger.info(f"Model saved to {args.output_dir}")
        
    except Exception as e:
        logger.error(f"Training failed with error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main() 