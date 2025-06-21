#!/bin/bash

echo "🚀 Starting Axis Thorn Local Test Environment"
echo "============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if Express is available (needed for local server)
if ! npm list express &> /dev/null; then
    echo "📦 Installing Express for local server..."
    npm install express
    echo ""
fi

echo "🔧 Starting local test server..."
echo ""
echo "📋 What you can test:"
echo "   ✅ API versioning (/api/v1/)"
echo "   ✅ Security middleware (CORS, validation, headers)"
echo "   ✅ Navigation consistency across pages"
echo "   ✅ Invoice API with validation"
echo "   ✅ Error handling and logging"
echo ""
echo "🌐 The server will run on: http://localhost:3000"
echo "🧪 Test client available at: ./test-client.html"
echo ""
echo "Press CTRL+C to stop the server"
echo "============================================="
echo ""

# Start the server
node local-test-server.js