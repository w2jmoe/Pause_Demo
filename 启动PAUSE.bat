@echo off
chcp 65001 >nul
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo 未找到 npm。请先安装 Node.js，并确认 npm 已加入系统 PATH。
  pause
  exit /b 1
)

echo 正在启动 PAUSE 开发服务器...
npm run dev
pause
