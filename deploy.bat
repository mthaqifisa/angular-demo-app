@echo off
echo Angular Demo App Deployment Script
echo ===================================
echo.
set /p env_name="Enter environment (dev/sit/uat/prod): "

REM Validate input
if "%env_name%"=="" (
    echo Invalid input. Please enter a valid environment (dev, sit, uat, or prod).
    exit /b 1
)

echo.
echo Updating Angular build configuration to %env_name%...

REM Modify defaultConfiguration in angular.json using PowerShell
powershell -Command "(Get-Content angular.json) -replace '\"defaultConfiguration\": \"[^\"]*\"', '\"defaultConfiguration\": \"%env_name%\"' | Set-Content angular.json"

echo Updated Angular configuration successfully!

docker kill angular-demo-app && docker rm angular-demo-app && docker rmi angular-demo-app-angular-app

echo.
echo Deploying %env_name% environment...
echo.

REM Create a temporary Dockerfile with dynamic environment configuration
copy Dockerfile Dockerfile.original > nul
(
    echo FROM node:20-alpine AS build
    echo WORKDIR /app
    echo COPY package.json package-lock.json ./
    echo RUN npm ci
    echo COPY . .
    echo RUN npm run build --configuration=%env_name%
    echo.
    echo FROM nginx:alpine
    echo COPY --from=build /app/dist/angular-demo-app/browser /usr/share/nginx/html
    echo COPY nginx.conf /etc/nginx/conf.d/default.conf
    echo EXPOSE 80
    echo CMD ["nginx", "-g", "daemon off;"]
) > Dockerfile.temp
move /y Dockerfile.temp Dockerfile > nul

docker compose up -d

REM Restore original Dockerfile
move /y Dockerfile.original Dockerfile > nul

echo.
echo %env_name% environment deployed successfully!
echo Container is now running. Access the application at http://localhost:8088
