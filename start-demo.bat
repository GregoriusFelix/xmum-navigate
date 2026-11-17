@echo off
rem Opens the backend (port 3000) and the frontend (port 5173) in two windows. Close a window to stop that server.
cd /d "%~dp0"
start "XMUM backend" cmd /k "cd backend && npm run dev"
start "XMUM frontend" cmd /k "cd frontend && npm run dev"
