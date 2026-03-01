.PHONY: install start stop test-backend

install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing backend dependencies..."
	cd backend && npm install

start: stop
	@echo "Starting backend and frontend..."
	@# Start backend in the background
	cd backend && npm run dev & echo $$! > backend.pid
	@# Start frontend in the background
	cd frontend && npm run dev & echo $$! > frontend.pid
	@echo "Servers started."
	@echo "Frontend PID: $$(cat frontend.pid), Backend PID: $$(cat backend.pid)"

stop:
	@echo "Stopping backend and frontend processes..."
	-@lsof -t -i:3000 | xargs kill -9 2>/dev/null || true
	-@lsof -t -i:3001 | xargs kill -9 2>/dev/null || true
	-@pkill -9 -f "node server.js" 2>/dev/null || true
	-@pkill -9 -f "next" 2>/dev/null || true
	-@pkill -9 -f "chrome" 2>/dev/null || true
	-@pkill -9 -f "Chromium" 2>/dev/null || true
	-@kill -9 $$(cat backend.pid) 2>/dev/null || true
	-@kill -9 $$(cat frontend.pid) 2>/dev/null || true
	@rm -f backend.pid frontend.pid
	@echo "All related processes terminated."

clean-session: stop
	@echo "Clearing WhatsApp session data..."
	rm -rf backend/.wwebjs_auth
	@echo "Session data cleared. You will need to scan the QR code again."

test-backend:
	@echo "Running backend tests..."
	cd backend && npm test
