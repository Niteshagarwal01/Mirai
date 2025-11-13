"""
This module provides functionality for automated marketing outreach
using contact information from Excel files.
"""

import pandas as pd
import os
import time
from datetime import datetime, timedelta
from colorama import Fore, Style
from src.agents import Agents
from src.state import Email
from src.tools.GmailTools import GmailToolsClass

class MarketingAutomation:
    def __init__(self):
        """Initialize the marketing automation module."""
        self.agents = Agents()
        self.gmail_tools = GmailToolsClass()
        self.leads_processed = set()
        self.load_processed_leads()
    
    def load_processed_leads(self):
        """Load already processed leads from file to avoid duplicate emails."""
        try:
            if os.path.exists('processed_leads.txt'):
                with open('processed_leads.txt', 'r') as f:
                    self.leads_processed.update(f.read().splitlines())
                print(f"Loaded {len(self.leads_processed)} previously processed leads")
        except Exception as e:
            print(f"Error loading processed leads: {e}")
    
    def save_processed_lead(self, email):
        """Save a processed lead to avoid sending duplicate emails."""
        try:
            with open('processed_leads.txt', 'a') as f:
                f.write(f"{email}\n")
        except Exception as e:
            print(f"Error saving processed lead: {e}")
    
    def read_contacts_from_excel(self, filepath):
        """
        Read contact information from an Excel file.
        
        Expected Excel columns:
        - company_name: Name of the company
        - contact_person: Full name of the contact person
        - role: Role/title of the contact person
        - email: Email address of the contact person
        - industry: Industry the company is in (optional)
        - company_size: Size of the company (optional)
        """
        try:
            # Read the Excel file
            df = pd.read_excel(filepath)
            
            # Check required columns
            required_cols = ['company_name', 'contact_person', 'role', 'email']
            for col in required_cols:
                if col not in df.columns:
                    print(f"Error: Excel file is missing required column '{col}'")
                    return []
            
            # Filter out rows with missing emails or already processed leads
            valid_contacts = []
            for _, row in df.iterrows():
                if pd.isna(row['email']) or not row['email'] or row['email'] in self.leads_processed:
                    continue
                
                contact = {
                    'company_name': row['company_name'] if not pd.isna(row['company_name']) else "your company",
                    'contact_person': row['contact_person'] if not pd.isna(row['contact_person']) else "there",
                    'role': row['role'] if not pd.isna(row['role']) else "professional",
                    'email': row['email'],
                    'industry': row['industry'] if 'industry' in df.columns and not pd.isna(row['industry']) else None,
                    'company_size': row['company_size'] if 'company_size' in df.columns and not pd.isna(row['company_size']) else None
                }
                valid_contacts.append(contact)
            
            print(f"Found {len(valid_contacts)} valid contacts to process")
            return valid_contacts
        
        except Exception as e:
            print(f"Error reading Excel file: {e}")
            return []
    
    def generate_outreach_email(self, contact):
        """
        Generate a personalized marketing outreach email for a contact.
        """
        # Use the fixed email template with personalization
        email_body = f"""Hi,

I hope you're doing well.

Greetings from Restfree!

I would like to introduce Restfree to you. It is an AI-powered travel companion designed to make movement and rest experiences seamless. We're currently raising a pre-seed round and would love to share our pitch deck for your review.

Kindly find the pitch deck attached below for your kind consideration.

Looking forward to your thoughts and feedback.

Best regards,
Amit Sharma
Founder & CEO
Restfree.in
+919306130639"""
        
        print(f"Using fixed outreach email for {contact['contact_person']} at {contact['company_name']}...")
        return email_body
    
    def _create_outreach_prompt(self, contact):
        """Create a detailed prompt for the email writer."""
        # Build industry-specific context if available
        industry_context = ""
        if contact['industry']:
            industry_context = f"Their company is in the {contact['industry']} industry. "
        
        size_context = ""
        if contact['company_size']:
            size_context = f"They have approximately {contact['company_size']} employees. "
        
        # Create the prompt
        return (
            f"# **EMAIL CATEGORY:** marketing_outreach\n\n"
            f"# **EMAIL CONTENT:**\n"
            f"This is an outreach email to a potential client. "
            f"The recipient is {contact['contact_person']}, who is a {contact['role']} at {contact['company_name']}. "
            f"{industry_context}{size_context}\n\n"
            f"# **INFORMATION:**\n"
            f"Mirai is an AI-driven marketing automation platform designed to simplify and enhance digital "
            f"marketing for businesses. Our innovative platform empowers companies to create stunning product "
            f"visuals, provide exceptional customer support, generate engaging content, and gain valuable "
            f"customer insights—all in one unified solution.\n\n"
            f"We offer the following pricing options:\n"
            f"* Starter Package - $99/month: AI visual content generation (up to 50 images/month), basic customer "
            f"support automation, content generation (up to 10 pieces/month), essential analytics dashboard.\n"
            f"* Professional Package - $249/month: AI visual content generation (up to 200 images/month), advanced "
            f"customer support automation, content generation (up to 50 pieces/month), enhanced analytics with "
            f"detailed reporting, 3D model generation (up to 10/month).\n"
            f"* Enterprise Package - $599/month: Unlimited AI visual content generation, comprehensive customer "
            f"support automation, unlimited content generation, advanced analytics with custom dashboards, "
            f"unlimited 3D model generation, priority technical support, API access for custom integrations.\n\n"
            f"The email should be a brief, professional introduction to Mirai's services, highlighting how we can "
            f"help their company specifically. The email should offer a free demo or consultation call and include "
            f"a clear call to action. It should not be too pushy or sales-oriented, but rather informative and helpful."
        )
    
    def _fallback_email_template(self, contact):
        """Provide a fallback email template if generation fails."""
        return f"""
Dear {contact['contact_person']},

I hope this email finds you well. My name is Alex from Mirai, and I noticed your work at {contact['company_name']}.

Mirai is an AI-driven marketing automation platform that helps companies streamline content creation, enhance customer support, and gain valuable insights—all in one solution. Our platform is particularly valuable for professionals like yourself in {contact['role']} roles.

I'd be happy to provide a personalized demo showing how Mirai could benefit {contact['company_name']} specifically. Would you be available for a 15-minute call next week?

Best regards,
Alex Johnson
Mirai Team
support@mirai-ai.com
(555) 123-4567
        """.strip()
    
    def send_marketing_emails(self, filepath, limit=None, delay_minutes=5):
        """
        Send marketing emails to contacts from an Excel file.
        
        Args:
            filepath (str): Path to the Excel file containing contacts
            limit (int, optional): Maximum number of emails to send
            delay_minutes (int, optional): Delay between emails in minutes
        """
        contacts = self.read_contacts_from_excel(filepath)
        
        if not contacts:
            print(f"{Fore.RED}No valid contacts found to process{Style.RESET_ALL}")
            return
        
        # Apply limit if specified
        if limit and limit > 0:
            contacts = contacts[:limit]
            print(f"Limiting to {limit} contacts as specified")
        
        # Process each contact
        for i, contact in enumerate(contacts):
            print(f"\n{Fore.CYAN}Processing contact {i+1}/{len(contacts)}: {contact['contact_person']} <{contact['email']}>{Style.RESET_ALL}")
            
            # Generate personalized email
            email_body = self.generate_outreach_email(contact)
            
            # Create subject line
            subject = "Pre-Seed Pitch: Restfree — The AI-Powered Travel Companion"
            
            # Create a mock email object
            mock_email = Email(
                id=f"outreach_{i}",
                threadId=f"outreach_thread_{i}",
                messageId=f"<outreach_{i}@mirai-mail.com>",
                references="",
                sender=contact['email'],
                subject=subject,
                body=f"[This is a mock email body for outreach purposes]"
            )
            
            # Send the email
            try:
                print(f"Sending email to {contact['email']}...")
                self.gmail_tools.send_marketing_email(
                    recipient=contact['email'],
                    subject=subject,
                    body=email_body,
                    recipient_name=contact['contact_person'],
                    attachment_path="pitch_deck.pdf"
                )
                print(f"{Fore.GREEN}Successfully sent email to {contact['email']}{Style.RESET_ALL}")
                
                # Mark as processed
                self.leads_processed.add(contact['email'])
                self.save_processed_lead(contact['email'])
                
                # Wait between emails to avoid sending too many at once
                if i < len(contacts) - 1 and delay_minutes > 0:
                    print(f"Waiting {delay_minutes} minutes before sending the next email...")
                    # In a real implementation, uncomment the following line:
                    # time.sleep(delay_minutes * 60)
                    
            except Exception as e:
                print(f"{Fore.RED}Failed to send email to {contact['email']}: {e}{Style.RESET_ALL}")
        
        print(f"\n{Fore.GREEN}Marketing campaign completed. Sent {len(contacts)} emails.{Style.RESET_ALL}")
