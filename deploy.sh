#!/bin/bash

echo "Angular Demo App Deployment Script"
echo "==================================="

echo
read -p "Enter environment (dev/sit/uat/prod): " env_choice

# Validate input
if [[ "$env_choice" != "dev" && "$env_choice" != "sit" && "$env_choice" != "uat" && "$env_choice" != "prod" ]]; then
    echo "Invalid choice. Please enter a valid environment (dev, sit, uat, or prod)."
    exit 1
fi

echo
echo "Updating Angular build configuration to $env_choice..."

# Modify defaultConfiguration in angular.json using sed
sed -i '' "s/\"defaultConfiguration\": \"[^\"]*\"/\"defaultConfiguration\": \"$env_choice\"/" angular.json

echo "Updated Angular configuration successfully!"

docker kill angular-demo-app && docker rm angular-demo-app && docker rmi angular-demo-app-angular-app

echo
echo "Deploying $env_choice environment..."
echo

# Create a temporary Dockerfile with dynamic environment configuration
cp Dockerfile Dockerfile.original
cat <<EOF > Dockerfile.temp
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build --configuration=$env_choice

FROM nginx:alpine
COPY --from=build /app/dist/angular-demo-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
mv Dockerfile.temp Dockerfile

docker compose up -d

# Restore original Dockerfile
mv Dockerfile.original Dockerfile

echo
echo "$env_choice environment deployed successfully!"
echo "Container is now running. Access the application at http://localhost:8088"
