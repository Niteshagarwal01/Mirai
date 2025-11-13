"""
Marketing Campaign Runner

This script runs a marketing outreach campaign using contact information from an Excel file.
It sends personalized emails to potential leads and tracks which contacts have been processed.

Usage:
    python run_marketing_campaign.py [excel_file] [--limit N] [--delay M]

Arguments:
    excel_file: Path to the Excel file containing contact information
    --limit N: Limit the number of emails to send (default: no limit)
    --delay M: Delay between emails in minutes (default: 5 minutes)

Example:
    python run_marketing_campaign.py contacts.xlsx --limit 5 --delay 10
"""

import os
import sys
import argparse
from dotenv import load_dotenv
from src.marketing_automation import MarketingAutomation

def parse_arguments():
    parser = argparse.ArgumentParser(
        description='Run a marketing outreach campaign using contact information from an Excel file.'
    )
    parser.add_argument(
        'excel_file',
        nargs='?',
        default='marketing_contacts_template.xlsx',  # Use marketing_contacts_template.xlsx as default
        help='Path to the Excel file containing contact information'
    )
    parser.add_argument(
        '--limit',
        type=int,
        help='Limit the number of emails to send (default: no limit)',
        default=None
    )
    parser.add_argument(
        '--delay',
        type=float,
        help='Delay between emails in minutes (default: 0.1667 minutes = 10 seconds)',
        default=0.1667
    )
    return parser.parse_args()

def main():
    # Load environment variables
    load_dotenv()
    
    # Parse command-line arguments
    args = parse_arguments()
    
    # Check if file exists
    if not os.path.exists(args.excel_file):
        print(f"Error: Excel file '{args.excel_file}' does not exist")
        print("\nDo you want to:")
        print("1. Create a contacts template file")
        print("2. Use the existing demo_contacts.xlsx if available")
        print("3. Exit")
        choice = input("Enter your choice (1-3): ")
        
        if choice == '1':
            try:
                from create_contacts_template import create_sample_excel
                create_sample_excel()
                args.excel_file = 'marketing_contacts_template.xlsx'
                print("\nUsing the newly created template file. Please remember to update it with real contacts later.")
            except Exception as e:
                print(f"Error creating template: {e}")
                sys.exit(1)
        elif choice == '2' and os.path.exists('demo_contacts.xlsx'):
            args.excel_file = 'demo_contacts.xlsx'
            print("\nUsing demo_contacts.xlsx file.")
        else:
            print("Exiting program.")
            sys.exit(1)
    
    print(f"Starting marketing campaign with contacts from '{args.excel_file}'")
    print(f"Email limit: {'No limit' if args.limit is None else args.limit}")
    print(f"Delay between emails: {args.delay} minutes")
    
    # Initialize marketing automation
    automation = MarketingAutomation()
    
    # Run the campaign
    automation.send_marketing_emails(
        filepath=args.excel_file,
        limit=args.limit,
        delay_minutes=args.delay
    )

if __name__ == "__main__":
    main()
