# Qwen Training Environment

A complete training environment for fine-tuning Alibaba's Qwen language models using LoRA (Low-Rank Adaptation) for efficient parameter updates.

## Features

- 🚀 **Efficient Training**: LoRA adapters for memory-efficient fine-tuning
- 💾 **Flexible Data**: Support for custom datasets in JSONL format
- 🔧 **Configurable**: Extensive hyperparameter customization
- 📊 **Monitoring**: Built-in logging and checkpointing
- 🖥️ **Cross-Platform**: CPU and GPU support

## Quick Start

### 1. Setup Environment

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Prepare Training Data

Create a JSONL file with your training examples:

```json
{"prompt": "User question or instruction", "response": "Expected model response"}
{"prompt": "Another example", "response": "Another response"}
```

### 3. Start Training

```bash
python train.py \
  --model_name_or_path Qwen/Qwen1.5-1.8B \
  --train_file data/your_dataset.jsonl \
  --output_dir outputs/my-model \
  --per_device_train_batch_size 2 \
  --gradient_accumulation_steps 4 \
  --num_train_epochs 3 \
  --learning_rate 2e-4
```

### 4. Test Your Model

```bash
python inference.py \
  --model_path outputs/my-model \
  --prompt "Your test prompt here"
```

## Configuration Options

### Training Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--model_name_or_path` | Base model to fine-tune | `Qwen/Qwen1.5-1.8B` |
| `--train_file` | Path to training JSONL file | Required |
| `--output_dir` | Directory to save model | `outputs/` |
| `--per_device_train_batch_size` | Batch size per device | `1` |
| `--gradient_accumulation_steps` | Gradient accumulation steps | `8` |
| `--num_train_epochs` | Number of training epochs | `3` |
| `--learning_rate` | Learning rate | `2e-4` |
| `--max_seq_length` | Maximum sequence length | `2048` |

### LoRA Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--lora_r` | LoRA rank | `8` |
| `--lora_alpha` | LoRA alpha scaling | `32` |
| `--lora_dropout` | LoRA dropout rate | `0.05` |

## Advanced Usage

### Multi-GPU Training

```bash
accelerate launch --num_processes 2 train.py [args...]
```

### Custom Data Processing

The training script expects JSONL format with `prompt` and `response` fields. For custom formats, modify the `SFTDataset` class in `train.py`.

### Memory Optimization

For limited memory:
- Reduce `per_device_train_batch_size`
- Increase `gradient_accumulation_steps`
- Use `--cpu_only` flag for CPU training

## File Structure

```
qwen_training/
├── train.py              # Main training script
├── inference.py          # Inference script
├── requirements.txt      # Dependencies
├── data/                 # Training data directory
├── outputs/              # Model outputs
└── README.md            # This file
```

## Supported Models

- Qwen1.5-0.5B
- Qwen1.5-1.8B
- Qwen1.5-4B
- Qwen1.5-7B
- Qwen1.5-14B
- Qwen1.5-32B
- Qwen1.5-72B

## Troubleshooting

### Common Issues

1. **CUDA out of memory**: Reduce batch size or use gradient checkpointing
2. **Slow training on CPU**: Consider using smaller models or cloud GPU
3. **Import errors**: Ensure all requirements are installed correctly

### Performance Tips

- Use appropriate batch size for your hardware
- Monitor GPU/CPU utilization
- Use mixed precision training when available
- Consider data preprocessing for large datasets

## License

This training environment is provided as-is for educational and research purposes.

## Contributing

Feel free to submit issues and enhancement requests! 