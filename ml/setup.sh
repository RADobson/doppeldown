#!/bin/bash
#
# Setup script for DoppelDown ML Threat Detection
#

set -e

echo "=============================================="
echo "DoppelDown ML Setup"
echo "=============================================="

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $PYTHON_VERSION"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "Creating directories..."
mkdir -p models data logs

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

echo ""
echo "=============================================="
echo "Setup complete!"
echo "=============================================="
echo ""
echo "Next steps:"
echo "  1. Train models: python src/train.py"
echo "  2. Run demo: python demo.py"
echo "  3. Start API: python src/api_server.py"
echo ""
echo "Or run all tests: python tests/test_ml_threat_detection.py"
echo ""
