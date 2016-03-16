@echo off
:start
call node facebots
cls
echo Restarting...
timeout /t 3 /nobreak > NUL
goto start
pause >nul