from colorama import Fore, Style
from src.graph import Workflow
from dotenv import load_dotenv
import os
import sys
import time

# Load environment variables with error handling
try:
    # Try loading from .env file
    env_loaded = load_dotenv()
    if not env_loaded:
        print(Fore.YELLOW + "Warning: No .env file found or it's empty. Using system environment variables." + Style.RESET_ALL)
except Exception as e:
    print(Fore.RED + f"Error loading environment variables: {e}" + Style.RESET_ALL)
    print("Creating an empty .env file...")
    # Create an empty .env file if it doesn't exist or has issues
    with open(".env", "w", encoding="utf-8") as f:
        f.write("# Gmail configuration\nMY_EMAIL=your_email@gmail.com\n\n# API Keys\nGROQ_API_KEY=your_groq_api_key\nGEMINI_API_KEY=your_gemini_api_key\n")
    print(Fore.YELLOW + "Please edit the .env file with your credentials and restart the application." + Style.RESET_ALL)
    sys.exit(1)

# Check for required environment variables
required_vars = ["MY_EMAIL", "GEMINI_API_KEY"]
optional_vars = ["GROQ_API_KEY"]  # Optional but recommended
missing_vars = [var for var in required_vars if not os.getenv(var)]
missing_optional = [var for var in optional_vars if not os.getenv(var)]

if missing_vars:
    print(Fore.RED + f"Error: Missing required environment variables: {', '.join(missing_vars)}" + Style.RESET_ALL)
    print("Please add them to your .env file or environment and restart.")
    sys.exit(1)
    
if missing_optional:
    print(Fore.YELLOW + f"Warning: Missing optional environment variables: {', '.join(missing_optional)}" + Style.RESET_ALL)
    print("The application will use Gemini for all operations (no fallback to Llama).")

# config 
config = {'recursion_limit': 100}

# Print some helpful information at startup
print(Fore.CYAN + "=" * 60)
print("Email Automation System with LangGraph")
print("- Using Mirai company information")
print("- Fallback mechanism enabled (Llama → Gemini)")
print("- Vector index using 4 chunks per query")
print("=" * 60 + Style.RESET_ALL)

# Allow time to read the message
time.sleep(1)

workflow = Workflow()
app = workflow.app

initial_state = {
    "emails": [],
    "current_email": {
      "id": "",
      "threadId": "",
      "messageId": "",
      "references": "",
      "sender": "",
      "subject": "",
      "body": ""
    },
    "email_category": "",
    "generated_email": "",
    "rag_queries": [],
    "retrieved_documents": "",
    "writer_messages": [],
    "sendable": False,
    "trials": 0
}

# Run the automation
print(Fore.GREEN + "Starting workflow..." + Style.RESET_ALL)

try:
    for output in app.stream(initial_state, config):
        for key, value in output.items():
            print(Fore.CYAN + f"Finished running: {key}:" + Style.RESET_ALL)
except Exception as e:
    if "DefaultCredentialsError" in str(e):
        print(Fore.RED + "Error with Google API credentials:" + Style.RESET_ALL)
        print("Make sure your GEMINI_API_KEY is correctly set in the .env file.")
        print("If you're using service account credentials, ensure they are properly configured.")
        print("\nMore info:")
        print("1. Using API Key (recommended): Add GEMINI_API_KEY in .env file")
        print("2. Restart the application after making changes")
    else:
        print(Fore.RED + f"Error running workflow: {str(e)}" + Style.RESET_ALL)


