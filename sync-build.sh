#!/bin/bash

# Build the project
echo "Building project..."
NODE_ENV=production npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful. Syncing to public directory..."
    
    # Create backup of current public directory
    if [ -d "public" ]; then
        echo "Creating backup of current public directory..."
        cp -r public public.backup.$(date +%Y%m%d_%H%M%S)
    fi
    
    # Sync dist to public
    rsync -av --delete \
        --exclude='.DS_Store' \
        --exclude='*.map' \
        dist/ public/
    
    echo "Sync complete!"
else
    echo "Build failed. Not syncing to public directory."
    exit 1
fi