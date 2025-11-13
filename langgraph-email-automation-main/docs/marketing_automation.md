# Marketing Automation with Mirai

This document provides detailed instructions for using the marketing automation functionality 
in Mirai's AI-powered email automation system.

## Overview

The marketing automation module allows you to:

1. **Import contacts** from Excel files
2. **Generate personalized emails** for each contact based on their company, industry, and role
3. **Send automated marketing campaigns** with configurable limits and delays
4. **Track processed leads** to avoid duplicate emails

## Setup Instructions

### 1. Prerequisites

Ensure you have completed the general setup for the email automation system:

- Installed dependencies (`pip install -r requirements.txt`)
- Set up the `.env` file with API keys
- Configured Gmail API credentials

### 2. Prepare Contact Data

Create an Excel file with the following columns:

| Column         | Required | Description                           |
|----------------|----------|---------------------------------------|
| company_name   | Yes      | Name of the target company            |
| contact_person | Yes      | Name of the contact person            |
| role           | Yes      | Role/position of the contact person   |
| email          | Yes      | Email address of the contact          |
| industry       | No       | Industry of the company               |
| company_size   | No       | Size of the company (employees/range) |

You can generate a template file using:

```bash
python create_contacts_template.py
```

### 3. Running a Campaign

To run a marketing campaign:

```bash
python run_marketing_campaign.py path_to_contacts.xlsx [options]
```

Options:
- `--limit N`: Limit the number of emails to send (default: no limit)
- `--delay M`: Minutes to wait between sending emails (default: 5)

Example:
```bash
python run_marketing_campaign.py contacts.xlsx --limit 10 --delay 15
```

### 4. Tracking and Management

- Processed leads are tracked in `processed_leads.txt`
- To reset the processed leads (allowing re-sending to the same contacts):
  ```bash
  python clear_processed_leads.py
  ```

## How It Works

1. **Contact Reading**: The system reads contacts from the specified Excel file
2. **Email Generation**: For each contact, a personalized email is generated using the AI
3. **Personalization**: The email is tailored based on the contact's industry, company size, and role
4. **Email Sending**: Emails are sent with configurable delays to avoid spam detection
5. **Lead Tracking**: Processed leads are tracked to prevent duplicates

## Best Practices

- **Start Small**: Begin with a small batch of contacts to test your campaign
- **Personalize Content**: Update the company information in `data/agency.txt` to ensure emails reference correct features and pricing
- **Monitor Responses**: Regularly check your inbox for responses to your campaigns
- **Test Before Scaling**: Use the `test_marketing_automation.py` script to verify everything works before a large campaign

## Troubleshooting

If you encounter issues:

1. **Email Generation Fails**: The system will fall back to a template email
2. **Rate Limiting**: Increase the delay between emails if you hit Gmail's sending limits
3. **API Errors**: Check your Gmail API credentials and quota limits

For any other issues, check the error messages in the console output for guidance.
