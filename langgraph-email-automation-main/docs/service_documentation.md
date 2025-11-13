# Mirai Marketing Automation Service Documentation

## Overview

Mirai Marketing Automation is a comprehensive service that enables companies to automate their marketing outreach efforts. This document explains how to set up, configure, and use the service for multiple client companies.

## Table of Contents

1. [Service Architecture](#service-architecture)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Managing Companies](#managing-companies)
5. [Running Marketing Campaigns](#running-marketing-campaigns)
6. [API Integration](#api-integration)
7. [Customization Options](#customization-options)
8. [Troubleshooting](#troubleshooting)

## Service Architecture

Mirai Marketing Automation is designed as a multi-tenant service that can simultaneously support multiple client companies. Key components include:

- **ConfigManager**: Handles company-specific configurations
- **CompanyManager**: Manages company registration and data storage
- **EnhancedMarketingAutomation**: Core engine for marketing automation
- **ServiceManager**: Command-line interface for service administration
- **API Service**: RESTful API for third-party integration

## Installation

### Prerequisites

- Python 3.8+
- Gmail API credentials
- Groq and/or Google Gemini API keys

### Setup Steps

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/mirai-marketing-automation.git
cd mirai-marketing-automation
pip install -r requirements.txt
```

2. Create a `.env` file with your API keys:

```
GOOGLE_API_KEY=your_google_api_key
GROQ_API_KEY=your_groq_api_key
MY_EMAIL=your_gmail_address
```

3. Set up Gmail API credentials:
   - Follow the instructions in `GMAIL_SETUP.md`
   - Place the `credentials.json` file in the root directory

## Configuration

### Company Configuration

Each client company has its own configuration file in YAML format stored in the `config` directory. These files contain:

- Company identity information
- Email sender settings
- Custom email templates
- Service offerings and pricing
- Campaign settings

You can create a new company configuration using the `service_manager.py` script:

```bash
python service_manager.py register "Client Company" contact@example.com "Contact Person" --website example.com --phone "123-456-7890" --plan professional
```

After registration, customize the company's configuration file at `config/Client Company.yaml`.

## Managing Companies

The `service_manager.py` script provides a command-line interface for managing companies:

```bash
# List all registered companies
python service_manager.py list

# Select a company for operations
python service_manager.py select "Client Company"

# View company statistics
python service_manager.py stats

# Create a contacts template for the selected company
python service_manager.py contacts --name potential_leads
```

## Running Marketing Campaigns

### Prepare Contact Data

Create an Excel file with the following columns:

- `company_name` (required)
- `contact_person` (required)
- `role` (required)
- `email` (required)
- `industry` (optional)
- `company_size` (optional)

You can use the built-in template generator:

```bash
python service_manager.py select "Client Company"
python service_manager.py contacts --name target_leads
```

### Run a Campaign

```bash
# Run a campaign with specific settings
python service_manager.py select "Client Company"
python service_manager.py campaign companies/Client\ Company/contacts/target_leads.xlsx --limit 10 --delay 5

# Or use the API for programmatic access
curl -X POST "http://localhost:8000/api/campaign" \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d @contacts.json
```

## API Integration

The service includes a RESTful API for third-party integration. Start the API server with:

```bash
python api.py
```

Key API endpoints:

- `POST /api/register`: Register a new company
- `POST /api/key`: Generate an API key for a company
- `POST /api/campaign`: Run a marketing campaign with provided contacts
- `POST /api/upload`: Upload an Excel file with contacts and run a campaign
- `GET /api/stats`: Get campaign statistics

Full API documentation is available at `http://localhost:8000/docs` when the API server is running.

## Customization Options

### Email Templates

Each company can customize its email templates in the configuration file:

```yaml
templates:
  subjects:
    marketing_outreach: "Custom subject line for {recipient_company}"
  custom_snippets:
    intro: "Custom introduction for {recipient} at {company}"
    closing: "Custom closing paragraph"
```

### Offerings and Pricing

Define custom service offerings and pricing:

```yaml
offerings:
  packages:
    - name: "Basic Package"
      price: "$149/month"
      features:
        - "Feature 1"
        - "Feature 2"
    # More packages...
```

### Campaign Settings

Configure default campaign behavior:

```yaml
campaign:
  default_delay_minutes: 10
  max_emails_per_day: 50
  working_hours:
    start: "09:00"
    end: "17:00"
  timezone: "America/New_York"
```

## Troubleshooting

### Common Issues

1. **API Key Errors**:
   - Ensure your API keys are correctly set in the `.env` file
   - Check that the API keys have not expired

2. **Gmail API Issues**:
   - Verify your Gmail API credentials are valid
   - Check if OAuth token needs to be refreshed

3. **Rate Limiting**:
   - The system automatically falls back to Gemini when Groq is rate-limited
   - Increase the delay between emails if sending too many emails too quickly

### Support

For additional support, contact support@mirai-ai.com.

---

© 2025 Mirai AI - All rights reserved
