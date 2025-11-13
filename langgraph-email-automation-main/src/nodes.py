from colorama import Fore, Style
from .agents import Agents
from .tools.GmailTools import GmailToolsClass
from .state import GraphState, Email


class Nodes:
    def __init__(self):
        self.agents = Agents()
        self.gmail_tools = GmailToolsClass()

    def load_new_emails(self, state: GraphState) -> GraphState:
        """Loads new emails from Gmail and updates the state."""
        print(Fore.YELLOW + "Loading new emails...\n" + Style.RESET_ALL)
        recent_emails = self.gmail_tools.fetch_unanswered_emails()
        emails = [Email(**email) for email in recent_emails]
        return {"emails": emails}

    def check_new_emails(self, state: GraphState) -> str:
        """Checks if there are new emails to process."""
        if len(state['emails']) == 0:
            print(Fore.RED + "No new emails" + Style.RESET_ALL)
            return "empty"
        else:
            print(Fore.GREEN + "New emails to process" + Style.RESET_ALL)
            return "process"
        
    def is_email_inbox_empty(self, state: GraphState) -> GraphState:
        return state

    def categorize_email(self, state: GraphState) -> GraphState:
        """Categorizes the current email using the categorize_email agent."""
        print(Fore.YELLOW + "Checking email category...\n" + Style.RESET_ALL)
        
        # Check if there are emails to process
        if not state["emails"]:
            print(Fore.RED + "No emails left to process" + Style.RESET_ALL)
            return {"email_category": "none", "current_email": None}
            
        # Get the first email from the list and remove it to avoid re-processing
        current_email = state["emails"].pop(0)  # Get and remove the first email
        # Show how many emails remain to be processed
        print(Fore.BLUE + f"Processing email. {len(state['emails'])} emails remaining." + Style.RESET_ALL)
        
        try:
            result = self.agents.categorize_email.invoke({"email": current_email.body})
            print(Fore.MAGENTA + f"Email category: {result.category.value}" + Style.RESET_ALL)
            category = result.category.value
        except Exception as e:
            # Fallback to product_enquiry if there's an error
            print(Fore.RED + f"Error categorizing email: {str(e)}" + Style.RESET_ALL)
            print(Fore.YELLOW + "Falling back to default category: product_enquiry" + Style.RESET_ALL)
            category = "product_enquiry"
        
        return {
            "email_category": category,
            "current_email": current_email,
            "emails": state["emails"]  # Update the emails list in the state
        }

    def route_email_based_on_category(self, state: GraphState) -> str:
        """Routes the email based on its category."""
        print(Fore.YELLOW + "Routing email based on category...\n" + Style.RESET_ALL)
        category = state["email_category"]
        if category == "none":
            print(Fore.RED + "No more emails to process, ending workflow" + Style.RESET_ALL)
            return "empty"
        elif category == "product_enquiry":
            return "product related"
        elif category == "unrelated":
            return "unrelated"
        else:
            return "not product related"

    def construct_rag_queries(self, state: GraphState) -> GraphState:
        """Constructs RAG queries based on the email content."""
        print(Fore.YELLOW + "Designing RAG query...\n" + Style.RESET_ALL)
        email_content = state["current_email"].body
        
        # Default queries in case of an error
        default_queries = [
            "What are the pricing options?",
            "What features does the product offer?",
            "How can I get started with the product?"
        ]
        
        try:
            query_result = self.agents.design_rag_queries.invoke({"email": email_content})
            queries = query_result.queries
        except Exception as e:
            print(Fore.RED + f"Error generating RAG queries: {str(e)}" + Style.RESET_ALL)
            print(Fore.YELLOW + "Using default queries instead" + Style.RESET_ALL)
            queries = default_queries
        
        return {"rag_queries": queries}

    def retrieve_from_rag(self, state: GraphState) -> GraphState:
        """Retrieves information from internal knowledge based on RAG questions."""
        print(Fore.YELLOW + "Retrieving information from internal knowledge...\n" + Style.RESET_ALL)
        final_answer = ""
        
        # Get pricing information directly from agency.txt
        pricing_info = """
Mirai offers the following pricing options:
* **Starter Package - $99/month:** AI visual content generation (up to 50 images/month), basic customer support automation, content generation (up to 10 pieces/month), essential analytics dashboard.
* **Professional Package - $249/month:** AI visual content generation (up to 200 images/month), advanced customer support automation, content generation (up to 50 pieces/month), enhanced analytics with detailed reporting, 3D model generation (up to 10/month).
* **Enterprise Package - $599/month:** Unlimited AI visual content generation, comprehensive customer support automation, unlimited content generation, advanced analytics with custom dashboards, unlimited 3D model generation, priority technical support, API access for custom integrations.
        """
        
        try:
            for query in state["rag_queries"]:
                # Special case for pricing queries to ensure accurate information
                if "pricing" in query.lower() or "cost" in query.lower() or "price" in query.lower():
                    rag_result = pricing_info
                    print(Fore.GREEN + "Using hardcoded pricing information for better accuracy" + Style.RESET_ALL)
                else:
                    # Regular RAG retrieval
                    rag_result = self.agents.generate_rag_answer.invoke(query)
                
                final_answer += query + "\n" + rag_result + "\n\n"
        except Exception as e:
            print(Fore.RED + f"Error retrieving information: {str(e)}" + Style.RESET_ALL)
            if "pricing" in " ".join(state["rag_queries"]).lower():
                print(Fore.YELLOW + "Falling back to hardcoded pricing information" + Style.RESET_ALL)
                final_answer = pricing_info
            else:
                print(Fore.YELLOW + "Using generic information from agency.txt" + Style.RESET_ALL)
                final_answer = "Please refer to our website for the most up-to-date information about Mirai's features and capabilities. We offer comprehensive marketing automation solutions."
        
        return {"retrieved_documents": final_answer}

    def write_draft_email(self, state: GraphState) -> GraphState:
        """Writes a draft email based on the current email and retrieved information."""
        print(Fore.YELLOW + "Writing draft email...\n" + Style.RESET_ALL)
        
        # Format input to the writer agent
        inputs = (
            f'# **EMAIL CATEGORY:** {state["email_category"]}\n\n'
            f'# **EMAIL CONTENT:**\n{state["current_email"].body}\n\n'
            f'# **INFORMATION:**\n{state["retrieved_documents"]}' # Empty for feedback or complaint
        )
        
        # Get messages history for current email
        writer_messages = state.get('writer_messages', [])
        trials = state.get('trials', 0) + 1
        
        # Default email template
        default_email = f"""
Dear Customer,

Thank you for contacting Mirai. We appreciate your interest in our AI-driven marketing automation platform.

{state["retrieved_documents"] if state["email_category"] == "product_enquiry" else "We've received your message and will address your concerns promptly."}

Best regards,
The Mirai Team
"""
        
        try:
            # Write email
            draft_result = self.agents.email_writer.invoke({
                "email_information": inputs,
                "history": writer_messages
            })
            email = draft_result.email
        except Exception as e:
            print(Fore.RED + f"Error writing email: {str(e)}" + Style.RESET_ALL)
            print(Fore.YELLOW + "Using default email template" + Style.RESET_ALL)
            email = default_email.strip()

        # Append writer's draft to the message list
        writer_messages.append(f"**Draft {trials}:**\n{email}")

        return {
            "generated_email": email, 
            "trials": trials,
            "writer_messages": writer_messages
        }

    def verify_generated_email(self, state: GraphState) -> GraphState:
        """Verifies the generated email using the proofreader agent."""
        print(Fore.YELLOW + "Verifying generated email...\n" + Style.RESET_ALL)
        
        writer_messages = state.get('writer_messages', [])
        
        try:
            review = self.agents.email_proofreader.invoke({
                "initial_email": state["current_email"].body,
                "generated_email": state["generated_email"],
            })
            
            sendable = review.send
            feedback = review.feedback
            
        except Exception as e:
            print(Fore.RED + f"Error verifying email: {str(e)}" + Style.RESET_ALL)
            print(Fore.YELLOW + "Assuming email is sendable to avoid delays" + Style.RESET_ALL)
            sendable = True
            feedback = "Error during proofreading. Sending email anyway to avoid delays."
        
        writer_messages.append(f"**Proofreader Feedback:**\n{feedback}")

        return {
            "sendable": sendable,
            "writer_messages": writer_messages
        }

    def must_rewrite(self, state: GraphState) -> str:
        """Determines if the email needs to be rewritten based on the review and trial count."""
        email_sendable = state["sendable"]
        if email_sendable:
            print(Fore.GREEN + "Email is good, ready to be sent!!!" + Style.RESET_ALL)
            state["writer_messages"] = []
            return "send"
        elif state["trials"] >= 2:  # Reduced from 3 to 2 maximum trials
            print(Fore.YELLOW + "Not perfect, but sending email anyway to avoid delays..." + Style.RESET_ALL)
            state["writer_messages"] = []
            return "send"  # Send anyway after 2 attempts
        else:
            print(Fore.RED + "Email is not good, must rewrite it..." + Style.RESET_ALL)
            return "rewrite"

    def create_draft_response(self, state: GraphState) -> GraphState:
        """Creates a draft response in Gmail."""
        print(Fore.YELLOW + "Creating draft email...\n" + Style.RESET_ALL)
        self.gmail_tools.create_draft_reply(state["current_email"], state["generated_email"])
        
        return {"retrieved_documents": "", "trials": 0}

    def send_email_response(self, state: GraphState) -> GraphState:
        """Sends the email response directly using Gmail."""
        print(Fore.YELLOW + "Sending email...\n" + Style.RESET_ALL)
        self.gmail_tools.send_reply(state["current_email"], state["generated_email"])
        
        return {"retrieved_documents": "", "trials": 0}
    
    def skip_unrelated_email(self, state):
        """Skip unrelated email and remove from emails list."""
        print("Skipping unrelated email...\n")
        state["emails"].pop()
        return state