"""
Utility script to clear the list of processed leads.

This can be useful when you want to:
- Start a fresh marketing campaign
- Re-send emails to previously contacted leads
- Reset the system after testing
"""

import os
import argparse

def clear_processed_leads(confirm=False):
    """Clear the list of processed leads."""
    file_path = 'processed_leads.txt'
    
    if not os.path.exists(file_path):
        print(f"No processed leads file found at {file_path}.")
        return
    
    if not confirm:
        response = input(f"Are you sure you want to clear all processed leads? This will allow the system to send emails to these addresses again. (y/n): ")
        if response.lower() != 'y':
            print("Operation cancelled.")
            return
    
    try:
        # Either truncate the file or remove it
        with open(file_path, 'w') as f:
            pass  # Truncate file
        print(f"Successfully cleared all processed leads from {file_path}.")
    except Exception as e:
        print(f"Error clearing processed leads: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Clear the list of processed leads.')
    parser.add_argument('--force', action='store_true', help='Clear without confirmation prompt')
    args = parser.parse_args()
    
    clear_processed_leads(confirm=args.force)
