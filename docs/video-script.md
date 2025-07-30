# 5-Minute Demo Walkthrough Script

## Introduction (30 seconds)
"Welcome to the Agentic RAG Chatbot demonstration. This is a sophisticated multi-agent system that processes documents using the Model Context Protocol, or MCP, to provide intelligent question-answering capabilities.

What makes this system unique is its three-agent architecture that communicates through structured message passing, creating a transparent and traceable AI workflow."

## System Overview (45 seconds)
"Let me show you the interface. On the left, we have our control panel showing uploaded documents and real-time agent status. The main area is our chat interface where users interact with the system.

The three agents work together: the IngestionAgent handles document parsing and chunking, the RetrievalAgent performs vector searches to find relevant context, and the LLMResponseAgent generates the final response using that context."

## Demo: Document Upload (30 seconds)
"First, let's upload some documents. The system supports multiple formats - PDF, Word documents, CSV files, PowerPoint presentations, text files, and Markdown. Watch as I upload a sales report and some metrics data.

Notice how the system immediately shows the files are being processed by the IngestionAgent, and we can see the real-time status updates."

## Demo: Asking Questions (60 seconds)
"Now let's ask a question: 'What KPIs were tracked in Q1?' 

Watch the agent orchestration in action. First, the system shows all three agents become active. The IngestionAgent has already processed our documents, so the RetrievalAgent immediately starts searching the vector database for relevant content.

You can see the agents communicating through MCP messages - structured data that includes sender, receiver, trace IDs, and payloads. This makes the entire process transparent and debuggable."

## Architecture Deep Dive (90 seconds)
"The architecture diagram shows how our agents communicate. Each agent has a specific responsibility and they pass structured messages using the Model Context Protocol.

Here's what an actual MCP message looks like - it includes the message type, sender and receiver agents, a unique trace ID for debugging, and the payload containing the actual data being passed between agents.

The RetrievalAgent has found relevant context from our uploaded documents and is now passing that to the LLMResponseAgent. Notice how we can track confidence scores and source documents throughout the process."

## Response and Features (45 seconds)
"And here's our response! The system provides a comprehensive answer based on the uploaded documents, with direct source attribution. Users can click on source references to see exactly which documents contributed to the answer.

The agent trace at the bottom shows the complete execution flow - document parsing completed, vector search executed with 3 relevant chunks found, and the LLM response generated successfully."

## Technical Stack & MCP Benefits (30 seconds)
"The frontend is built with React and TypeScript for a modern, responsive experience. The backend uses FastAPI with Python agents, FAISS for vector storage, and OpenAI for embeddings and language generation.

The Model Context Protocol provides structured communication, message tracing for debugging, and makes the system highly extensible for adding new agents."

## Closing (30 seconds)
"This Agentic RAG system demonstrates how multiple AI agents can work together effectively using structured protocols. The combination of document processing, vector retrieval, and intelligent response generation creates a powerful tool for document-based question answering.

The code is production-ready with comprehensive documentation, testing, and deployment guides. Thank you for watching!"

---

## Technical Notes for Recording:
- Show actual file uploads with different formats
- Demonstrate real-time agent status changes
- Highlight the MCP message structure in developer tools
- Show source attribution clicking functionality
- Display the agent trace expansion
- Keep camera focused on key UI elements during explanations