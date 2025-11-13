"""
Repository Cleanup Script

This script helps maintain a clean repository by:
1. Removing __pycache__ directories
2. Clearing processed data files
3. Removing any database files

Usage:
    python cleanup_repo.py [--all]
"""

import os
import argparse
import shutil

def cleanup_pycache():
    """Remove all __pycache__ directories."""
    count = 0
    for root, dirs, files in os.walk('.'):
        if '__pycache__' in dirs:
            pycache_path = os.path.join(root, '__pycache__')
            try:
                shutil.rmtree(pycache_path)
                print(f"Removed: {pycache_path}")
                count += 1
            except Exception as e:
                print(f"Error removing {pycache_path}: {e}")
    
    return count

def clear_processed_data():
    """Clear processed data files."""
    files_to_clear = ['processed_leads.txt', 'processed_threads.txt']
    count = 0
    
    for file in files_to_clear:
        if os.path.exists(file):
            try:
                with open(file, 'w') as f:
                    pass  # Truncate the file
                print(f"Cleared: {file}")
                count += 1
            except Exception as e:
                print(f"Error clearing {file}: {e}")
    
    return count

def remove_db_files(remove_all=False):
    """Remove database files."""
    count = 0
    
    # Always try to remove the chroma.sqlite3 file
    if os.path.exists('db/chroma.sqlite3'):
        try:
            os.remove('db/chroma.sqlite3')
            print(f"Removed: db/chroma.sqlite3")
            count += 1
        except Exception as e:
            print(f"Error removing db/chroma.sqlite3: {e}")
    
    # Remove all DB directory if --all flag is used
    if remove_all and os.path.exists('db'):
        try:
            shutil.rmtree('db')
            print("Removed entire db/ directory")
            count += 1
        except Exception as e:
            print(f"Error removing db/ directory: {e}")
    
    return count

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Clean up repository files')
    parser.add_argument('--all', action='store_true', help='Remove all generated files, including the entire db directory')
    args = parser.parse_args()
    
    print("Starting repository cleanup...")
    
    pycache_count = cleanup_pycache()
    processed_count = clear_processed_data()
    db_count = remove_db_files(args.all)
    
    total = pycache_count + processed_count + db_count
    print(f"Cleanup complete: {total} items processed")
    print("- Python cache directories:", pycache_count)
    print("- Processed data files:", processed_count)
    print("- Database files:", db_count)
