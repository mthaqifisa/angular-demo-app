#!/usr/bin/env node
/**
 * deploy.js – A cross-platform deployment script for your Angular Demo App.
 *
 * It does the following:
 *  1. Prompts the user for an environment (dev/sit/uat/prod).
 *  2. Updates angular.json’s build defaultConfiguration property.
 *  3. Kills and removes an existing Docker container and image, if they exist.
 *  4. Backups the current Dockerfile, creates a temporary Dockerfile with a dynamic build configuration,
 *     then runs "docker compose up -d".
 *  5. Finally, restores the original Dockerfile.
 */

const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Angular Demo App Deployment Script");
console.log("===================================");

rl.question("Enter environment (dev/sit/uat/prod): ", (env) => {
  env = env.trim().toLowerCase();
  const allowed = ['dev', 'sit', 'uat', 'prod'];
  if (!allowed.includes(env)) {
    console.error("Invalid input. Please enter a valid environment (dev, sit, uat, or prod).");
    process.exit(1);
  }

  console.log(`\nUpdating Angular build configuration to ${env}...`);

  // Update angular.json by reading, parsing, modifying, and rewriting the JSON file.
  const angularJsonPath = path.join(__dirname, 'angular.json');
  try {
    const rawData = fs.readFileSync(angularJsonPath, 'utf8');
    const angularJson = JSON.parse(rawData);

    // Update the build defaultConfiguration value:
    if (
      angularJson.projects &&
      angularJson.projects['angular-demo-app'] &&
      angularJson.projects['angular-demo-app'].architect &&
      angularJson.projects['angular-demo-app'].architect.build
    ) {
      angularJson.projects['angular-demo-app'].architect.build.defaultConfiguration = env;
    } else {
      console.error("The build configuration in angular.json could not be found.");
      process.exit(1);
    }
    fs.writeFileSync(angularJsonPath, JSON.stringify(angularJson, null, 2), 'utf8');
    console.log("Updated Angular configuration successfully!");
  } catch (err) {
    console.error("Error updating angular.json:", err);
    process.exit(1);
  }

  // Stop and remove any existing Docker container/image (errors ignored in case container/image don't exist)
  try {
    console.log("\nStopping and removing existing Docker container (if any)...");
    try {
      execSync("docker kill angular-demo-app", { stdio: 'inherit' });
    } catch (err) { /* ignore errors if container isn't running */ }
    try {
      execSync("docker rm angular-demo-app", { stdio: 'inherit' });
    } catch (err) { /* ignore errors */ }
    try {
      execSync("docker rmi angular-demo-app-angular-app", { stdio: 'inherit' });
    } catch (err) { /* ignore errors */ }
  } catch (err) {
    console.error("Error removing existing docker containers/images:", err);
  }

  console.log(`\nDeploying ${env} environment...\n`);

  // Backup Dockerfile
  const dockerfilePath = path.join(__dirname, 'Dockerfile');
  const dockerfileBackupPath = path.join(__dirname, 'Dockerfile.original');
  try {
    fs.copyFileSync(dockerfilePath, dockerfileBackupPath);
  } catch (err) {
    console.error("Error creating backup of Dockerfile:", err);
    process.exit(1);
  }

  // Create a temporary Dockerfile with the dynamic build configuration.
  const dockerfileContent = `FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build --configuration=${env}

FROM nginx:alpine
COPY --from=build /app/dist/angular-demo-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;
  const tempDockerfilePath = path.join(__dirname, 'Dockerfile.temp');
  try {
    fs.writeFileSync(tempDockerfilePath, dockerfileContent, 'utf8');
    // Replace the existing Dockerfile with the temporary one:
    fs.renameSync(tempDockerfilePath, dockerfilePath);
  } catch (err) {
    console.error("Error creating temporary Dockerfile:", err);
    process.exit(1);
  }

  // Start Docker Compose
  try {
    execSync("docker compose up -d", { stdio: 'inherit' });
  } catch (err) {
    console.error("Error running 'docker compose up -d':", err);
    process.exit(1);
  }

  // Restore the original Dockerfile
  try {
    fs.renameSync(dockerfileBackupPath, dockerfilePath);
  } catch (err) {
    console.error("Error restoring the original Dockerfile:", err);
    process.exit(1);
  }

  console.log(`\n${env} environment deployed successfully!`);
  console.log("Container is now running. Access the application at http://localhost:8088");

  rl.close();
});
