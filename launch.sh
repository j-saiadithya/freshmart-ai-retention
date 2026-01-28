#!/bin/bash

echo "🚀 Launching FreshMart AI Retention System..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Function to kill process on port
kill_port() {
    pid=$(lsof -ti :$1 2>/dev/null)
    if [ ! -z "$pid" ]; then
        kill -9 $pid 2>/dev/null
        echo "Killed process on port $1"
    fi
}

# Check and kill existing processes
echo -e "${BLUE}Checking for existing processes...${NC}"
kill_port 8000
kill_port 3000

# Start Backend
echo -e "${BLUE}Starting Backend (FastAPI)...${NC}"
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# FIX: Downgrade numpy to compatible version
echo "Fixing numpy version incompatibility..."
pip install --force-reinstall "numpy==1.24.3" "pandas==2.0.3"

# Install remaining requirements (skip already installed)
echo "Checking other dependencies..."
pip install fastapi uvicorn python-dotenv scikit-learn transformers twilio sqlalchemy

# Check if main.py exists
if [ ! -f "src/main.py" ]; then
    echo -e "${RED}❌ Error: src/main.py not found!${NC}"
    exit 1
fi

# Test imports
echo "Testing imports..."
cd src
python3 -c "
try:
    from main import app
    print('✅ Successfully imported app')
    print('✅ Starting server...')
except Exception as e:
    print(f'❌ Import error: {e}')
    import traceback
    traceback.print_exc()
    exit 1
"

# Start backend in background
python -m main &
BACKEND_PID=$!
cd ../..
sleep 8

# Check if backend started
if check_port 8000; then
    echo -e "${GREEN}✅ Backend running on http://localhost:8000${NC}"
    echo -e "${GREEN}✅ API Docs: http://localhost:8000/docs${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    echo "Trying alternative startup method..."
    
    # Try with uvicorn directly
    cd backend
    source venv/bin/activate
    cd src
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
    BACKEND_PID=$!
    cd ../..
    sleep 8
    
    if check_port 8000; then
        echo -e "${GREEN}✅ Backend started via uvicorn${NC}"
    else
        echo -e "${RED}❌ Backend startup failed${NC}"
        echo "Try running manually:"
        echo "cd backend"
        echo "source venv/bin/activate"
        echo "pip install --force-reinstall numpy==1.24.3 pandas==2.0.3"
        echo "cd src"
        echo "python -m main"
        exit 1
    fi
fi

# Start Frontend
echo -e "${BLUE}Starting Frontend (React)...${NC}"
cd frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in frontend/${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

# Start frontend in background
echo "Starting React app..."
npm start &
FRONTEND_PID=$!
sleep 10

# Check if frontend started
if check_port 3000; then
    echo -e "${GREEN}✅ Frontend running on http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    echo "Trying alternative port 3001..."
    
    PORT=3001 npm start &
    FRONTEND_PID=$!
    sleep 10
    
    if check_port 3001; then
        echo -e "${GREEN}✅ Frontend running on http://localhost:3001${NC}"
    else
        echo -e "${RED}❌ Frontend startup failed${NC}"
        echo "Try running manually:"
        echo "cd frontend"
        echo "npm start"
    fi
fi

echo ""
echo "========================================"
echo -e "${GREEN}🎉 FreshMart AI Retention System is running!${NC}"
echo "========================================"
echo ""
echo -e "${BLUE}📊 Frontend Dashboard:${NC} http://localhost:3000"
echo -e "${BLUE}🔧 Backend API:${NC} http://localhost:8000"
echo -e "${BLUE}📚 API Documentation:${NC} http://localhost:8000/docs"
echo ""
echo -e "${BLUE}📱 Test Endpoints:${NC}"
echo "  • GET  http://localhost:8000/health"
echo "  • GET  http://localhost:8000/api/campaigns/status"
echo "  • POST http://localhost:8000/api/campaigns/sms/retention?limit=5"
echo ""
echo -e "${BLUE}🔍 Quick Tests:${NC}"
echo "  • curl http://localhost:8000/health"
echo "  • curl http://localhost:8000/api/customers"
echo ""
echo "========================================"
echo -e "${RED}Press Ctrl+C to stop both servers${NC}"
echo "========================================"

# Cleanup function
cleanup() {
    echo -e "\n${RED}Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

trap cleanup INT TERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID