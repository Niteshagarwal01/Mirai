"""
Create a sample Excel file for marketing contacts

This script creates a template Excel file with sample contact data
that can be used with the marketing automation system.
"""

import pandas as pd
import os

def create_sample_excel():
    # Create sample data
    data = {
        'company_name': [
            'ABC Corp', 
            'XYZ Industries', 
            'Acme Solutions', 
            'Tech Innovations Inc', 
            'Global Services Ltd'
        ],
        'contact_person': [
            'John Smith', 
            'Jane Doe', 
            'Robert Johnson', 
            'Emily Chen', 
            'Michael Brown'
        ],
        'role': [
            'Marketing Director', 
            'CEO', 
            'CTO', 
            'Head of Digital', 
            'VP of Sales'
        ],
        'email': [
            'john.smith@abccorp.example', 
            'jane.doe@xyzindustries.example', 
            'robert@acmesolutions.example', 
            'emily.chen@techinnovations.example', 
            'michael.brown@globalservices.example'
        ],
        'industry': [
            'Manufacturing', 
            'Technology', 
            'Healthcare', 
            'E-commerce', 
            'Financial Services'
        ],
        'company_size': [
            '50-100', 
            '500+', 
            '10-50', 
            '100-500', 
            '1000+'
        ]
    }
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Create file path
    file_path = 'marketing_contacts_template.xlsx'
    
    # Save to Excel
    df.to_excel(file_path, index=False)
    
    print(f"Created sample Excel file: {file_path}")
    print("IMPORTANT: Please replace the sample emails with real target emails before running the campaign.")

if __name__ == "__main__":
    create_sample_excel()
