# Simple Sitecore JSS Next.js Sample Application with Personalization & Tracking

## Local environment setup

*Note: this sample requires a Sitecore instance. Disconnected mode is not supported.*

1. Create a new app based on this starter using JSS CLI via `jss create app-name nextjs-personalization-and-tracking`

2. Create a API Key item in your Sitecore instance.

3. Create configuration for your app using JSS CLI via `npx jss setup`. Customize your hostname and API Key in this step.

4. Update `sitecore\config\JssNextPersonalizedWeb.config` with your hostname and API

5. Deploy configs to your local Sitecore instance via `jss deploy config`

6. Install Sitecore CLI using powershell. `dotnet tool restore`

7. Authorize Sitecore CLI to interact with your Sitecore instance.

`dotnet sitecore login --cm https://cm.hostname/ --auth https://identity.hostname/ --allow-write true`

8. Deploy serialized items via `dotnet sitecore ser push`

## Local development

From JSS repo root:
```
npm i
npm run bootstrap
npm run build-packages
```

From sample root:
```
npm i
jss start
```

This starts the Next.js server on localhost:3000. Ngrok can be used to expose this endpoint to Sitecore.
1. Run `ngrok http -host-header=rewrite 3000`
2. Update the app definition in your Sitecore config and redeploy config. Ex. `serverSideRenderingEngineEndpointUrl="https://d8a8bf6620e8.ngrok.io/api/editing/render"` 

Now you should be able to view the app in Experience Editor.