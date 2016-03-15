
@echo off


where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (

    set SETUP_DIR=%CD%

    echo NodeJs is not installed on this computer...
    echo.
    echo Press any key to download NodeJs...
    pause >nul 2<&1

if not exist "%systemdrive%\Program Files (x86)" (
    start https://nodejs.org/dist/v5.6.0/node-v5.6.0-x86.msi
) else (
    start https://nodejs.org/dist/v5.6.0/node-v5.6.0-x64.msi
)
cls
@echo.
@echo.
@echo Please open the downloaded file and follow the instructions when it's done downloading...
@echo Reopen this file after you have installed NodeJs...
@echo.
@echo.
@echo Press any key to exit...
pause >nul 2<&1
exit

) else (

@echo Cleaning cache... Please wait...
@ call npm cache clean
@cls
echo.
echo.
@echo Installing dependencies, please wait...
call npm install
cls
echo.
echo.
@echo npm installed successfully...

cls
echo.
echo.
@echo All dependencies installed successfully...
@echo.
@echo Press any key to exit...
@pause >nul 2<&1
)
