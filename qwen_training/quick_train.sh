#!/bin/bash

# Quick Training Script for Qwen Models
# This script provides a simple way to start training with reasonable defaults

set -e

# Default values
MODEL_NAME="Qwen/Qwen1.5-1.8B"
DATA_FILE="data/sample_data.jsonl"
OUTPUT_DIR="outputs/qwen-$(date +%Y%m%d-%H%M%S)"
EPOCHS=3
BATCH_SIZE=1
GRAD_ACCUM=8
LEARNING_RATE=2e-4

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Help function
show_help() {
    cat << EOF
Quick Training Script for Qwen Models

Usage: $0 [OPTIONS]

Options:
    -m, --model MODEL       Model name or path (default: $MODEL_NAME)
    -d, --data FILE         Training data file (default: $DATA_FILE)
    -o, --output DIR        Output directory (default: auto-generated)
    -e, --epochs NUM        Number of epochs (default: $EPOCHS)
    -b, --batch-size NUM    Batch size (default: $BATCH_SIZE)
    -g, --grad-accum NUM    Gradient accumulation steps (default: $GRAD_ACCUM)
    -l, --lr RATE           Learning rate (default: $LEARNING_RATE)
    --cpu                   Force CPU training
    --gpu                   Use GPU if available (default)
    -h, --help              Show this help message

Examples:
    $0                                          # Train with defaults
    $0 -d my_data.jsonl -e 5                   # Custom data and epochs
    $0 -m Qwen/Qwen1.5-7B --cpu               # Larger model on CPU
    $0 -o my_custom_output -b 2 -g 4           # Custom output and batch settings

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--model)
            MODEL_NAME="$2"
            shift 2
            ;;
        -d|--data)
            DATA_FILE="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -e|--epochs)
            EPOCHS="$2"
            shift 2
            ;;
        -b|--batch-size)
            BATCH_SIZE="$2"
            shift 2
            ;;
        -g|--grad-accum)
            GRAD_ACCUM="$2"
            shift 2
            ;;
        -l|--lr)
            LEARNING_RATE="$2"
            shift 2
            ;;
        --cpu)
            USE_CPU=true
            shift
            ;;
        --gpu)
            USE_CPU=false
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option $1"
            show_help
            exit 1
            ;;
    esac
done

# Main training function
main() {
    print_header "QWEN QUICK TRAINING SETUP"
    
    # Check if virtual environment exists
    if [[ ! -d "venv" ]] && [[ ! -d ".venv" ]]; then
        print_warning "No virtual environment detected. Creating one..."
        python3 -m venv venv
        print_status "Virtual environment created."
    fi
    
    # Activate virtual environment
    if [[ -d "venv" ]]; then
        source venv/bin/activate
        print_status "Activated virtual environment: venv"
    elif [[ -d ".venv" ]]; then
        source .venv/bin/activate
        print_status "Activated virtual environment: .venv"
    fi
    
    # Check if dependencies are installed
    if ! python -c "import transformers, peft, torch" 2>/dev/null; then
        print_warning "Dependencies not found. Installing..."
        pip install -r requirements.txt
        print_status "Dependencies installed."
    fi
    
    # Check if data file exists
    if [[ ! -f "$DATA_FILE" ]]; then
        print_error "Data file '$DATA_FILE' not found!"
        echo "Please ensure your training data exists or use -d to specify a different file."
        exit 1
    fi
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    print_status "Output directory: $OUTPUT_DIR"
    
    # Build training command
    TRAIN_CMD="python train.py"
    TRAIN_CMD="$TRAIN_CMD --model_name_or_path $MODEL_NAME"
    TRAIN_CMD="$TRAIN_CMD --train_file $DATA_FILE"
    TRAIN_CMD="$TRAIN_CMD --output_dir $OUTPUT_DIR"
    TRAIN_CMD="$TRAIN_CMD --per_device_train_batch_size $BATCH_SIZE"
    TRAIN_CMD="$TRAIN_CMD --gradient_accumulation_steps $GRAD_ACCUM"
    TRAIN_CMD="$TRAIN_CMD --num_train_epochs $EPOCHS"
    TRAIN_CMD="$TRAIN_CMD --learning_rate $LEARNING_RATE"
    TRAIN_CMD="$TRAIN_CMD --logging_steps 10"
    TRAIN_CMD="$TRAIN_CMD --save_steps 100"
    
    if [[ "$USE_CPU" == true ]]; then
        TRAIN_CMD="$TRAIN_CMD --cpu_only"
        print_status "Using CPU training"
    else
        print_status "Using GPU training (if available)"
    fi
    
    # Display configuration
    print_header "TRAINING CONFIGURATION"
    echo "Model: $MODEL_NAME"
    echo "Data: $DATA_FILE"
    echo "Output: $OUTPUT_DIR"
    echo "Epochs: $EPOCHS"
    echo "Batch Size: $BATCH_SIZE"
    echo "Gradient Accumulation: $GRAD_ACCUM"
    echo "Learning Rate: $LEARNING_RATE"
    echo "CPU Only: ${USE_CPU:-false}"
    echo ""
    
    # Ask for confirmation
    read -p "Start training? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Training cancelled."
        exit 0
    fi
    
    # Start training
    print_header "STARTING TRAINING"
    print_status "Command: $TRAIN_CMD"
    echo ""
    
    # Record start time
    START_TIME=$(date +%s)
    
    # Execute training
    if eval $TRAIN_CMD; then
        # Calculate training time
        END_TIME=$(date +%s)
        DURATION=$((END_TIME - START_TIME))
        HOURS=$((DURATION / 3600))
        MINUTES=$(((DURATION % 3600) / 60))
        SECONDS=$((DURATION % 60))
        
        print_header "TRAINING COMPLETED SUCCESSFULLY"
        print_status "Training time: ${HOURS}h ${MINUTES}m ${SECONDS}s"
        print_status "Model saved to: $OUTPUT_DIR"
        echo ""
        echo "To test your model, run:"
        echo "python inference.py --base_model $MODEL_NAME --model_path $OUTPUT_DIR --prompt 'Your test prompt here'"
        echo ""
        echo "Or for interactive mode:"
        echo "python inference.py --base_model $MODEL_NAME --model_path $OUTPUT_DIR --interactive"
    else
        print_error "Training failed!"
        exit 1
    fi
}

# Run main function
main 