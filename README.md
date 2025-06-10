# AngularDemoApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deploy app
To build application, run ``` ng build --configuration=<env>```

Example: ```ng build --configuration=prod```

**dist** folder will be created inside root path of the application

#### Option 1: serve in server (E.g. using Nginx or http-server or IIS)
- to use http-server, install it by running ```npm install -g http-server```

- host the application (dist folder) by running ```http-server dist/angular-demo-app/browser```

#### Option 2: deploy in docker (local docker)
- run the deploy.js script by runnning ```npm run deploy``` and follow the instructions on the screen


## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
