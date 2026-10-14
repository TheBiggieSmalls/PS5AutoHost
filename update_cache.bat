@echo off
title Update AppCache Manifest
echo Scanning directory and updating cache.appcache...

node update_cache.js

echo.
pause