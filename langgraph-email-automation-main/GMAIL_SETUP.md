# Setting Up Gmail API Credentials

This guide will help you set up the Gmail API credentials required for the Email Automation system.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown at the top of the page and select "New Project".
3. Enter a project name and click "Create".
4. Select your new project from the project dropdown.

## Step 2: Enable the Gmail API

1. Go to the [API Library](https://console.cloud.google.com/apis/library) in your Google Cloud Console.
2. Search for "Gmail API" and click on it.
3. Click "Enable".

## Step 3: Create OAuth Credentials

1. Go to the [Credentials page](https://console.cloud.google.com/apis/credentials).
2. Click "Create Credentials" and select "OAuth client ID".
3. If prompted, configure the OAuth consent screen:
   - Select "External" as the user type (unless you have a Google Workspace account)
   - Fill in the required fields (Application name, user support email, developer contact information)
   - For scopes, add the Gmail API with `.../auth/gmail.modify` scope
   - Add your email address as a test user
4. For the OAuth client ID:
   - Select "Desktop app" as the application type
   - Give it a name (e.g., "Email Automation Client")
   - Click "Create"
5. Download the credentials JSON file by clicking the download button.

## Step 4: Place Credentials in the Project

✅ DONE: The credentials.json file has been created in the root directory of the project.

## Step 5: Initial Authentication

When you run the application for the first time, it will:

1. Open a browser window asking you to log in to your Google account
2. Request permission to access your Gmail account
3. Create a `token.json` file that stores your authentication tokens

This authentication flow only needs to be completed once, after which the `token.json` file will be used for authentication.

## Important Notes

- The email address you authenticate with should match the `MY_EMAIL` value in your `.env` file.
- This application requires the `gmail.modify` scope, which gives it permission to read, modify, and send emails on your behalf.
- For security, keep your `credentials.json` and `token.json` files private and do not commit them to version control.
