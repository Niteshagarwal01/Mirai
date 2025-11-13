from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os

# Load environment variables from a .env file
load_dotenv()

RAG_SEARCH_PROMPT_TEMPLATE = """
Using the following pieces of retrieved context, answer the question comprehensively and concisely.
Ensure your response fully addresses the question based on the given context.

**IMPORTANT:**
Just provide the answer and never mention or refer to having access to the external context or information in your answer.
If you are unable to determine the answer from the provided context, state 'I don't know.'

Question: {question}
Context: {context}
"""

print("Loading & Chunking Docs...")
loader = TextLoader("./data/agency.txt")
docs = loader.load()

doc_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
doc_chunks = doc_splitter.split_documents(docs)

print("Creating vector embeddings...")
# Get Google API key from environment variables (check for both GEMINI_API_KEY and legacy GOOGLE_API_KEY)
google_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

if not google_api_key:
    print("Error: GEMINI_API_KEY not found in environment variables.")
    print("Please add GEMINI_API_KEY to your .env file and restart.")
    exit(1)
    
try:
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=google_api_key)
    print("✅ Successfully connected to Google Embeddings API")
except Exception as e:
    print(f"❌ Google Embeddings API error: {str(e)}")
    print("Please check your GEMINI_API_KEY in the .env file")
    exit(1)

vectorstore = Chroma.from_documents(doc_chunks, embeddings, persist_directory="db")

# Semantic vector search
vectorstore_retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# Test RAG chain
print("Test RAG chain...")
prompt = ChatPromptTemplate.from_template(RAG_SEARCH_PROMPT_TEMPLATE)
try:
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.1, google_api_key=google_api_key)
    print("✅ Successfully connected to Google Gemini API")
except Exception as e:
    print(f"❌ Google Gemini API error: {str(e)}")
    print("Please check your GEMINI_API_KEY in the .env file")
    exit(1)

rag_chain = (
    {"context": vectorstore_retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

query = "What are your pricing options?"
result = rag_chain.invoke(query)
print(f"Question: {query}")
print(f"Answer: {result}")

