Write-Host "STARTING TOOLBRAIN API"
Start-Process powershell "-NoExit", 
  "cd src; python -m uvicorn toolbrain_tracing.main:app --reload --port 8000"

Write-Host "STARTING WEB FRONTEND"
Start-Process powershell "-NoExit", 
  "cd web; npm run dev"

Start-Sleep -Seconds 3

Write-Host "OPENING IN CHROME"
Start-Process "chrome.exe" "http://localhost:5173/"