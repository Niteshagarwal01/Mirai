from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_groq import ChatGroq
from langchain_chroma import Chroma
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from .structure_outputs import *
from .prompts import *
import os
import time
from colorama import Fore, Style

class Agents():
    def __init__(self):
        # Get API keys from environment variables
        self.google_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        
        # Check if API keys are available
        if not self.google_api_key:
            print(Fore.RED + "❌ Error: GEMINI_API_KEY not found in environment variables." + Style.RESET_ALL)
            print("Please add GEMINI_API_KEY to your .env file and restart.")
            raise ValueError("GEMINI_API_KEY is required but not found in environment variables")
        
        # Setup models
        try:
            self.gemini = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.1, google_api_key=self.google_api_key)
            print(Fore.GREEN + "✅ Connected to Google Gemini API successfully" + Style.RESET_ALL)
        except Exception as e:
            print(Fore.RED + f"❌ Google Gemini API error: {str(e)}" + Style.RESET_ALL)
            print("Please check your GEMINI_API_KEY in the .env file and restart.")
            raise
            
        self.llama = None
        
        # Try to setup Llama, fallback to Gemini if there's an error
        try:
            self.llama = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.1, api_key=self.groq_api_key)
            print(Fore.GREEN + "✅ Connected to Groq API successfully" + Style.RESET_ALL)
        except Exception as e:
            print(Fore.YELLOW + f"⚠️ Groq API error: {str(e)}. Using Gemini for all operations..." + Style.RESET_ALL)
            self.llama = self.gemini  # Use Gemini as fallback
        
        # Choose the primary model (llama if available, otherwise gemini)
        self.primary_model = self.llama if self.llama else self.gemini
        
        # QA assistant chat - set up embeddings and retrieval
        try:
            embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=self.google_api_key)
            print(Fore.GREEN + "✅ Connected to Google Embeddings API successfully" + Style.RESET_ALL)
            
            try:
                vectorstore = Chroma(persist_directory="db", embedding_function=embeddings)
                print(Fore.GREEN + "✅ Connected to vector database successfully" + Style.RESET_ALL)
                retriever = vectorstore.as_retriever(search_kwargs={"k": 4}) # Increased to get more context
            except Exception as e:
                print(Fore.RED + f"❌ Vector database error: {str(e)}" + Style.RESET_ALL)
                print("You may need to run create_index.py first to build the vector index")
                raise
                
        except Exception as e:
            print(Fore.RED + f"❌ Google Embeddings API error: {str(e)}" + Style.RESET_ALL)
            print("Please check your GEMINI_API_KEY and internet connection")
            raise

        # Categorize email chain
        email_category_prompt = PromptTemplate(
            template=CATEGORIZE_EMAIL_PROMPT, 
            input_variables=["email"]
        )
        self.categorize_email = (
            email_category_prompt | 
            self.primary_model.with_structured_output(CategorizeEmailOutput)
        )

        # Used to design queries for RAG retrieval
        generate_query_prompt = PromptTemplate(
            template=GENERATE_RAG_QUERIES_PROMPT, 
            input_variables=["email"]
        )
        self.design_rag_queries = (
            generate_query_prompt | 
            self.primary_model.with_structured_output(RAGQueriesOutput)
        )
        
        # Generate answer to queries using RAG
        qa_prompt = ChatPromptTemplate.from_template(GENERATE_RAG_ANSWER_PROMPT)
        self.generate_rag_answer = (
            {"context": retriever, "question": RunnablePassthrough()}
            | qa_prompt
            | self.primary_model
            | StrOutputParser()
        )

        # Used to write a draft email based on category and related informations
        writer_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", EMAIL_WRITER_PROMPT),
                MessagesPlaceholder("history"),
                ("human", "{email_information}")
            ]
        )
        self.email_writer = (
            writer_prompt | 
            self.primary_model.with_structured_output(WriterOutput)
        )

        # Verify the generated email
        proofreader_prompt = PromptTemplate(
            template=EMAIL_PROOFREADER_PROMPT, 
            input_variables=["initial_email", "generated_email"]
        )
        self.email_proofreader = (
            proofreader_prompt | 
            self.primary_model.with_structured_output(ProofReaderOutput) 
        )

        # Fallback email writer that always uses Gemini (for when Groq hits rate limits)
        fallback_writer_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", EMAIL_WRITER_PROMPT),
                MessagesPlaceholder("history"),
                ("human", "{email_information}")
            ]
        )
        self.fallback_email_writer = (
            fallback_writer_prompt | 
            self.gemini.with_structured_output(WriterOutput)
        )