#!/usr/bin/env python3
"""
Qwen Model Inference Script

A comprehensive inference script for testing fine-tuned Qwen models.
Supports both base models and LoRA-adapted models.
"""

import argparse
import json
import logging
import time
from typing import List, Optional

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig
from peft import PeftModel

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Run inference with Qwen models"
    )
    
    parser.add_argument(
        "--model_path",
        type=str,
        required=True,
        help="Path to model (base model or LoRA adapter)"
    )
    parser.add_argument(
        "--base_model",
        type=str,
        help="Base model path (required if model_path is LoRA adapter)"
    )
    parser.add_argument(
        "--prompt",
        type=str,
        help="Single prompt for generation"
    )
    parser.add_argument(
        "--prompts_file",
        type=str,
        help="File containing prompts (one per line)"
    )
    parser.add_argument(
        "--max_new_tokens",
        type=int,
        default=512,
        help="Maximum number of new tokens to generate"
    )
    parser.add_argument(
        "--temperature",
        type=float,
        default=0.7,
        help="Sampling temperature"
    )
    parser.add_argument(
        "--top_p",
        type=float,
        default=0.9,
        help="Top-p (nucleus) sampling parameter"
    )
    parser.add_argument(
        "--top_k",
        type=int,
        default=50,
        help="Top-k sampling parameter"
    )
    parser.add_argument(
        "--repetition_penalty",
        type=float,
        default=1.1,
        help="Repetition penalty"
    )
    parser.add_argument(
        "--do_sample",
        action="store_true",
        default=True,
        help="Use sampling for generation"
    )
    parser.add_argument(
        "--num_beams",
        type=int,
        default=1,
        help="Number of beams for beam search"
    )
    parser.add_argument(
        "--batch_size",
        type=int,
        default=1,
        help="Batch size for inference"
    )
    parser.add_argument(
        "--output_file",
        type=str,
        help="File to save generation results"
    )
    parser.add_argument(
        "--device",
        type=str,
        default="auto",
        help="Device to use (auto, cpu, cuda)"
    )
    parser.add_argument(
        "--load_in_8bit",
        action="store_true",
        help="Load model in 8-bit precision"
    )
    parser.add_argument(
        "--load_in_4bit",
        action="store_true",
        help="Load model in 4-bit precision"
    )
    parser.add_argument(
        "--interactive",
        action="store_true",
        help="Interactive mode for chatting"
    )
    
    return parser.parse_args()


def load_model_and_tokenizer(args):
    """Load model and tokenizer."""
    logger.info("Loading tokenizer...")
    
    # Determine the tokenizer path
    tokenizer_path = args.base_model if args.base_model else args.model_path
    
    tokenizer = AutoTokenizer.from_pretrained(
        tokenizer_path,
        trust_remote_code=True,
        padding_side="left"
    )
    
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    logger.info("Loading model...")
    
    # Determine device
    if args.device == "auto":
        device_map = "auto"
    else:
        device_map = args.device
    
    # Determine precision
    torch_dtype = torch.float16
    if args.device == "cpu":
        torch_dtype = torch.float32
    
    # Load base model
    if args.base_model:
        # Loading LoRA adapter
        logger.info(f"Loading base model from {args.base_model}")
        
        model = AutoModelForCausalLM.from_pretrained(
            args.base_model,
            device_map=device_map,
            torch_dtype=torch_dtype,
            trust_remote_code=True,
            load_in_8bit=args.load_in_8bit,
            load_in_4bit=args.load_in_4bit,
        )
        
        logger.info(f"Loading LoRA adapter from {args.model_path}")
        model = PeftModel.from_pretrained(model, args.model_path)
        
    else:
        # Loading full model
        logger.info(f"Loading model from {args.model_path}")
        
        model = AutoModelForCausalLM.from_pretrained(
            args.model_path,
            device_map=device_map,
            torch_dtype=torch_dtype,
            trust_remote_code=True,
            load_in_8bit=args.load_in_8bit,
            load_in_4bit=args.load_in_4bit,
        )
    
    model.eval()
    
    return model, tokenizer


def generate_response(
    model,
    tokenizer,
    prompt: str,
    generation_config: GenerationConfig
) -> str:
    """Generate response for a single prompt."""
    
    # Tokenize input
    inputs = tokenizer(prompt, return_tensors="pt")
    
    # Move to device
    if hasattr(model, 'device'):
        inputs = {k: v.to(model.device) for k, v in inputs.items()}
    
    # Generate
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            generation_config=generation_config,
            pad_token_id=tokenizer.eos_token_id,
        )
    
    # Decode response
    response = tokenizer.decode(
        outputs[0][len(inputs["input_ids"][0]):], 
        skip_special_tokens=True
    )
    
    return response.strip()


def batch_generate(
    model,
    tokenizer,
    prompts: List[str],
    generation_config: GenerationConfig,
    batch_size: int = 1
) -> List[str]:
    """Generate responses for multiple prompts."""
    
    responses = []
    
    for i in range(0, len(prompts), batch_size):
        batch_prompts = prompts[i:i + batch_size]
        
        # Tokenize batch
        inputs = tokenizer(
            batch_prompts,
            return_tensors="pt",
            padding=True,
            truncation=True
        )
        
        # Move to device
        if hasattr(model, 'device'):
            inputs = {k: v.to(model.device) for k, v in inputs.items()}
        
        # Generate
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                generation_config=generation_config,
                pad_token_id=tokenizer.eos_token_id,
            )
        
        # Decode responses
        for j, output in enumerate(outputs):
            input_length = len(inputs["input_ids"][j])
            response = tokenizer.decode(
                output[input_length:], 
                skip_special_tokens=True
            )
            responses.append(response.strip())
    
    return responses


def interactive_mode(model, tokenizer, generation_config):
    """Run interactive chat mode."""
    logger.info("Starting interactive mode. Type 'quit' to exit.")
    
    print("\n" + "="*50)
    print("QWEN INTERACTIVE MODE")
    print("="*50)
    print("Type your prompts and press Enter. Type 'quit' to exit.")
    print("Type 'clear' to clear conversation history.")
    print("-"*50)
    
    conversation_history = []
    
    while True:
        try:
            # Get user input
            user_input = input("\nYou: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                break
            
            if user_input.lower() == 'clear':
                conversation_history = []
                print("Conversation history cleared.")
                continue
            
            if not user_input:
                continue
            
            # Build prompt with conversation history
            if conversation_history:
                prompt = "\n".join(conversation_history) + f"\nUser: {user_input}\nAssistant: "
            else:
                prompt = f"User: {user_input}\nAssistant: "
            
            # Generate response
            start_time = time.time()
            response = generate_response(model, tokenizer, prompt, generation_config)
            end_time = time.time()
            
            # Display response
            print(f"\nAssistant: {response}")
            print(f"\n[Generated in {end_time - start_time:.2f}s]")
            
            # Update conversation history
            conversation_history.append(f"User: {user_input}")
            conversation_history.append(f"Assistant: {response}")
            
            # Keep only last 10 exchanges
            if len(conversation_history) > 20:
                conversation_history = conversation_history[-20:]
                
        except KeyboardInterrupt:
            print("\n\nExiting...")
            break
        except Exception as e:
            print(f"\nError: {e}")


def main():
    """Main inference function."""
    args = parse_arguments()
    
    # Validate arguments
    if not args.prompt and not args.prompts_file and not args.interactive:
        logger.error("Must provide either --prompt, --prompts_file, or --interactive")
        return
    
    try:
        # Load model and tokenizer
        model, tokenizer = load_model_and_tokenizer(args)
        
        # Setup generation config
        generation_config = GenerationConfig(
            max_new_tokens=args.max_new_tokens,
            temperature=args.temperature,
            top_p=args.top_p,
            top_k=args.top_k,
            repetition_penalty=args.repetition_penalty,
            do_sample=args.do_sample,
            num_beams=args.num_beams,
        )
        
        # Interactive mode
        if args.interactive:
            interactive_mode(model, tokenizer, generation_config)
            return
        
        # Single prompt
        if args.prompt:
            logger.info("Generating response for single prompt...")
            start_time = time.time()
            response = generate_response(model, tokenizer, args.prompt, generation_config)
            end_time = time.time()
            
            print("\n" + "="*50)
            print("PROMPT:")
            print("="*50)
            print(args.prompt)
            print("\n" + "="*50)
            print("RESPONSE:")
            print("="*50)
            print(response)
            print(f"\n[Generated in {end_time - start_time:.2f}s]")
            
            if args.output_file:
                result = {
                    "prompt": args.prompt,
                    "response": response,
                    "generation_time": end_time - start_time
                }
                with open(args.output_file, "w") as f:
                    json.dump(result, f, indent=2)
        
        # Multiple prompts from file
        if args.prompts_file:
            logger.info(f"Loading prompts from {args.prompts_file}")
            
            with open(args.prompts_file, "r") as f:
                prompts = [line.strip() for line in f if line.strip()]
            
            logger.info(f"Generating responses for {len(prompts)} prompts...")
            start_time = time.time()
            responses = batch_generate(
                model, tokenizer, prompts, generation_config, args.batch_size
            )
            end_time = time.time()
            
            # Display results
            for i, (prompt, response) in enumerate(zip(prompts, responses)):
                print(f"\n{'='*50}")
                print(f"PROMPT {i+1}:")
                print('='*50)
                print(prompt)
                print(f"\n{'='*50}")
                print(f"RESPONSE {i+1}:")
                print('='*50)
                print(response)
            
            print(f"\n[Generated {len(prompts)} responses in {end_time - start_time:.2f}s]")
            
            if args.output_file:
                results = []
                for prompt, response in zip(prompts, responses):
                    results.append({
                        "prompt": prompt,
                        "response": response
                    })
                
                result = {
                    "results": results,
                    "total_generation_time": end_time - start_time,
                    "average_time_per_prompt": (end_time - start_time) / len(prompts)
                }
                
                with open(args.output_file, "w") as f:
                    json.dump(result, f, indent=2)
        
    except Exception as e:
        logger.error(f"Inference failed: {e}")
        raise


if __name__ == "__main__":
    main() 