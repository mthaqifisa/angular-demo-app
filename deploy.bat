@echo off
echo Angular Demo App Deployment Script
echo ===================================
echo.
echo Select the environment to deploy:
echo 1. Production
echo 2. Development
echo 3. UAT
echo.
set /p env_choice="Enter your choice (1-3): "

docker kill angular-demo-app && docker rm angular-demo-app && docker rmi angular-demo-app-angular-app

if "%env_choice%"=="1" (
    echo.
    echo Deploying Production environment...
    echo.

    REM Create a temporary Dockerfile for production
    copy Dockerfile Dockerfile.original > nul
    echo FROM node:20-alpine AS build > Dockerfile.temp
    echo WORKDIR /app >> Dockerfile.temp
    echo COPY package.json package-lock.json ./ >> Dockerfile.temp
    echo RUN npm ci >> Dockerfile.temp
    echo COPY . . >> Dockerfile.temp
    echo RUN npm run build --configuration=production >> Dockerfile.temp
    echo. >> Dockerfile.temp
    echo FROM nginx:alpine >> Dockerfile.temp
    echo COPY --from=build /app/dist/angular-demo-app/browser /usr/share/nginx/html >> Dockerfile.temp
    echo COPY nginx.conf /etc/nginx/conf.d/default.conf >> Dockerfile.temp
    echo EXPOSE 80 >> Dockerfile.temp
    echo CMD ["nginx", "-g", "daemon off;"] >> Dockerfile.temp
    move /y Dockerfile.temp Dockerfile > nul

    docker compose up -d

    REM Restore original Dockerfile
    move /y Dockerfile.original Dockerfile > nul

    echo.
    echo Production environment deployed successfully!
) else if "%env_choice%"=="2" (
    echo.
    echo Deploying Development environment...
    echo.

    REM Create a temporary Dockerfile for development
    copy Dockerfile Dockerfile.original > nul
    echo FROM node:20-alpine AS build > Dockerfile.temp
    echo WORKDIR /app >> Dockerfile.temp
    echo COPY package.json package-lock.json ./ >> Dockerfile.temp
    echo RUN npm ci >> Dockerfile.temp
    echo COPY . . >> Dockerfile.temp
    echo # Build with development configuration >> Dockerfile.temp
    echo RUN npm run build --configuration=development >> Dockerfile.temp
    echo. >> Dockerfile.temp
    echo FROM nginx:alpine >> Dockerfile.temp
    echo COPY --from=build /app/dist/angular-demo-app/browser /usr/share/nginx/html >> Dockerfile.temp
    echo COPY nginx.conf /etc/nginx/conf.d/default.conf >> Dockerfile.temp
    echo EXPOSE 80 >> Dockerfile.temp
    echo CMD ["nginx", "-g", "daemon off;"] >> Dockerfile.temp
    move /y Dockerfile.temp Dockerfile > nul

    docker compose up -d

    REM Restore original Dockerfile
    move /y Dockerfile.original Dockerfile > nul

    echo.
    echo Development environment deployed successfully!
) else if "%env_choice%"=="3" (
    echo.
    echo Deploying UAT environment...
    echo.

    REM Check if UAT environment file exists, create if not
    if not exist src\environments\environment.uat.ts (
        echo Creating UAT environment file...
        echo export const environment = { > src\environments\environment.uat.ts
        echo   production: true, >> src\environments\environment.uat.ts
        echo   featureToggle: true, >> src\environments\environment.uat.ts
        echo   apiUrl: 'https://uat-api.example.com', >> src\environments\environment.uat.ts
        echo }; >> src\environments\environment.uat.ts

        REM Add UAT configuration to angular.json if not already present
        echo Adding UAT configuration to angular.json...
        REM This would require a more complex script to modify JSON
        echo Please manually add UAT configuration to angular.json if needed.
    )

    REM Create a temporary Dockerfile for UAT
    copy Dockerfile Dockerfile.original > nul
    echo FROM node:20-alpine AS build > Dockerfile.temp
    echo WORKDIR /app >> Dockerfile.temp
    echo COPY package.json package-lock.json ./ >> Dockerfile.temp
    echo RUN npm ci >> Dockerfile.temp
    echo COPY . . >> Dockerfile.temp
    echo # Create a custom build command for UAT >> Dockerfile.temp
    echo RUN cp src/environments/environment.uat.ts src/environments/environment.prod.ts ^&^& npm run build --configuration=production >> Dockerfile.temp
    echo. >> Dockerfile.temp
    echo FROM nginx:alpine >> Dockerfile.temp
    echo COPY --from=build /app/dist/angular-demo-app/browser /usr/share/nginx/html >> Dockerfile.temp
    echo COPY nginx.conf /etc/nginx/conf.d/default.conf >> Dockerfile.temp
    echo EXPOSE 80 >> Dockerfile.temp
    echo CMD ["nginx", "-g", "daemon off;"] >> Dockerfile.temp
    move /y Dockerfile.temp Dockerfile > nul

    docker compose up -d

    REM Restore original Dockerfile
    move /y Dockerfile.original Dockerfile > nul

    echo.
    echo UAT environment deployed successfully!
) else (
    echo.
    echo Invalid choice. Please run the script again and select a valid option.
    exit /b 1
)

echo.
echo Container is now running. Access the application at http://localhost:8088
