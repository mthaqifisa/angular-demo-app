#!/usr/bin/env node
/**
 * deploy.js – A cross-platform deployment script for your Angular Demo App.
 *
 * Enhancements:
 *  - Prompts for `env` and `version`
 *  - Removes Docker image `angular-demo-app:<version>`
 *  - Updates `docker-compose.yml` with the new version
 *  - Preserves all existing logic for deployment
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

// Ask for Environment
rl.question("Enter environment (dev/sit/uat/prod): ", (env) => {
  env = env.trim().toLowerCase();
  const allowed = ['dev', 'sit', 'uat', 'prod'];
  if (!allowed.includes(env)) {
    console.error("Invalid input. Please enter a valid environment.");
    process.exit(1);
  }

  // Ask for Version
  rl.question("Enter version (e.g., 0.0.2): ", (version) => {
    version = version.trim();

    console.log(`\nRemoving old Docker image: angular-demo-app:${version}...`);
    try {
      execSync(`docker rmi angular-demo-app:${version}`, { stdio: 'inherit' });
    } catch (err) {
      console.warn(`Image angular-demo-app:${version} does not exist or could not be removed.`);
    }

    // Update docker-compose.yml
    console.log("\nUpdating docker-compose.yml...");
    const dockerComposePath = path.join(__dirname, 'docker-compose.yml');
    try {
      let composeData = fs.readFileSync(dockerComposePath, 'utf8');
      composeData = composeData.replace(/image: angular-demo-app:\d+\.\d+\.\d+/g, `image: angular-demo-app:${version}`);
      fs.writeFileSync(dockerComposePath, composeData, 'utf8');
      console.log("Docker Compose updated successfully!");
    } catch (err) {
      console.error("Error updating docker-compose.yml:", err);
      process.exit(1);
    }

    console.log(`\nEnvironment '${env}' deployed successfully with version '${version}'!`);

    // ---------------- EXISTING DEPLOYMENT LOGIC ----------------
    console.log(`\nUpdating Angular build configuration to ${env}...`);

    const angularJsonPath = path.join(__dirname, 'angular.json');
    try {
      const rawData = fs.readFileSync(angularJsonPath, 'utf8');
      const angularJson = JSON.parse(rawData);

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

    try {
      console.log("\nStopping and removing existing Docker container (if any)...");
      try {
        execSync("docker kill angular-demo-app", { stdio: 'inherit' });
      } catch (err) { /* ignore errors */ }
      try {
        execSync("docker rm angular-demo-app", { stdio: 'inherit' });
      } catch (err) { /* ignore errors */ }
      try {
        execSync("docker builder prune -f", { stdio: 'inherit' });
      } catch (err) { /* ignore errors */ }
    } catch (err) {
      console.error("Error removing existing docker containers/images:", err);
    }

    console.log(`\nDeploying ${env} environment...\n`);

    // Backup and Modify Dockerfile
    const dockerfilePath = path.join(__dirname, 'Dockerfile');
    const dockerfileBackupPath = path.join(__dirname, 'Dockerfile.original');
    try {
      fs.copyFileSync(dockerfilePath, dockerfileBackupPath);
    } catch (err) {
      console.error("Error creating backup of Dockerfile:", err);
      process.exit(1);
    }

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
      fs.renameSync(tempDockerfilePath, dockerfilePath);
    } catch (err) {
      console.error("Error creating temporary Dockerfile:", err);
      process.exit(1);
    }

    try {
      execSync("docker compose up -d", { stdio: 'inherit' });
    } catch (err) {
      console.error("Error running 'docker compose up -d':", err);
      process.exit(1);
    }

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
});
