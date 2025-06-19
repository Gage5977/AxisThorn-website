#!/bin/bash

# Qwen Training Starter Script
echo "🚀 Starting Qwen Training Environment Setup..."

# Check for data file
if [ ! -f "data/sample_data.jsonl" ]; then
    echo "❌ Sample data not found!"
    exit 1
fi

# Activate virtual environment if it exists
if [ -d ".venv" ]; then
    source .venv/bin/activate
    echo "✅ Virtual environment activated"
fi

# Install dependencies if needed
python -c "import transformers" 2>/dev/null || {
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
}

# Run training with sample data
echo "🎯 Starting training with sample data..."
python train.py \
    --model_name_or_path Qwen/Qwen1.5-1.8B \
    --train_file data/sample_data.jsonl \
    --output_dir outputs/qwen-trained \
    --per_device_train_batch_size 1 \
    --gradient_accumulation_steps 4 \
    --num_train_epochs 1 \
    --learning_rate 2e-4 \
    --logging_steps 5 \
    --save_steps 50 \
    --cpu_only

echo "✅ Training complete! Model saved to outputs/qwen-trained"
echo "🧪 Test your model with:"
echo "python inference.py --base_model Qwen/Qwen1.5-1.8B --model_path outputs/qwen-trained --interactive" 