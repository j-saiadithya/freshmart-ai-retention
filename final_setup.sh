#!/bin/bash
echo "==========================================="
echo "FreshMart AI - FINAL SETUP"
echo "==========================================="

# Stop everything
pkill -f uvicorn 2>/dev/null
pkill -f npm 2>/dev/null

echo ""
echo "1. Setting up Backend..."
cd backend

# Clean and create venv
rm -rf venv __pycache__ */__pycache__ 2>/dev/null
python3 -m venv venv

if [ -f "venv/bin/python3" ]; then
    echo "✅ Virtual environment created!"
    source venv/bin/activate
    
    echo "Installing Python packages..."
    pip install --upgrade pip
    pip install fastapi uvicorn pandas numpy scikit-learn transformers twilio sqlalchemy python-dotenv pydantic-settings
    
    cd src
    # Fix imports
    sed -i 's/from src\./from /g' main.py 2>/dev/null
    sed -i 's/import src\./import /g' main.py 2>/dev/null
    
    echo "✅ Backend ready!"
else
    echo "⚠️ Using system Python (venv failed)"
    cd src
    pip3 install --user --break-system-packages fastapi uvicorn pandas numpy scikit-learn transformers twilio
    
    # Fix imports
    sed -i 's/from src\./from /g' main.py 2>/dev/null
    sed -i 's/import src\./import /g' main.py 2>/dev/null
    
    echo "✅ Backend packages installed to user directory"
fi

echo ""
echo "2. Setting up Frontend..."
cd ../../frontend

rm -rf node_modules package-lock.json 2>/dev/null
npm cache clean --force 2>/dev/null
npm install --legacy-peer-deps

echo ""
echo "==========================================="
echo "🎉 SETUP COMPLETE!"
echo "==========================================="
echo ""
echo "To run:"
echo ""
echo "TERMINAL 1 - Backend:"
echo "  cd ~/Desktop/freshmart-ai-retention/backend"
if [ -d "venv" ]; then
    echo "  source venv/bin/activate"
fi
echo "  cd src"
echo "  python -m main"
echo ""
echo "TERMINAL 2 - Frontend:"
echo "  cd ~/Desktop/freshmart-ai-retention/frontend"
echo "  npm start"
echo ""
echo "Access at:"
echo "  Backend: http://localhost:8000"
echo "  Frontend: http://localhost:3000"
echo "  API Docs: http://localhost:8000/docs"
