#!/bin/bash
echo "🚀 Qwen Training Quick Start"
echo "Setting up environment..."

# Check if we have required files
if [ ! -f "train.py" ]; then
    echo "❌ train.py not found!"
    exit 1
fi

if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found!"
    exit 1
fi

# Create sample data if not exists
if [ ! -f "data/sample_data.jsonl" ]; then
    mkdir -p data
    echo '{"prompt": "What is Python?", "response": "Python is a high-level programming language known for its simplicity and readability."}' > data/sample_data.jsonl
    echo "✅ Created sample training data"
fi

# Activate virtual environment
if [ -d ".venv" ]; then
    source .venv/bin/activate
    echo "✅ Activated virtual environment"
fi

echo "🎯 Starting quick training run..."
python train.py \
    --model_name_or_path Qwen/Qwen1.5-1.8B \
    --train_file data/sample_data.jsonl \
    --output_dir outputs/qwen-quick \
    --per_device_train_batch_size 1 \
    --gradient_accumulation_steps 2 \
    --num_train_epochs 1 \
    --learning_rate 2e-4 \
    --logging_steps 2 \
    --save_steps 10 \
    --cpu_only

echo "✅ Training complete!"
echo "Test with: python inference.py --base_model Qwen/Qwen1.5-1.8B --model_path outputs/qwen-quick --prompt 'Hello!'" 