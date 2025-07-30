# Agentic RAG Chatbot with Model Context Protocol (MCP)

## Slide 1: Project Overview
**Agentic RAG Chatbot System**
- Full-stack intelligent document processing and Q&A system
- Multi-agent architecture with Model Context Protocol (MCP)
- Support for PDF, DOCX, CSV, PPTX, TXT, and Markdown files
- Real-time agent communication and status tracking

## Slide 2: Architecture Diagram
```
┌─────────────────┐    MCP     ┌─────────────────┐    MCP     ┌─────────────────┐
│  IngestionAgent │ ────────→  │ RetrievalAgent  │ ────────→  │LLMResponseAgent │
│                 │            │                 │            │                 │
│ • Parse docs    │            │ • Vector search │            │ • Generate      │
│ • Chunk text    │            │ • Find context  │            │   response      │
│ • Preprocess    │            │ • Rank results  │            │ • Format output │
└─────────────────┘            └─────────────────┘            └─────────────────┘
         │                              │                              │
         ▼                              ▼                              ▼
┌─────────────────┐            ┌─────────────────┐            ┌─────────────────┐
│   Document      │            │   Vector DB     │            │    LLM API      │
│   Storage       │            │   (FAISS)       │            │   (OpenAI)      │
└─────────────────┘            └─────────────────┘            └─────────────────┘
```

## Slide 3: Model Context Protocol (MCP) Implementation
**Structured Message Format:**
```json
{
  "type": "RETRIEVAL_RESULT",
  "sender": "RetrievalAgent", 
  "receiver": "LLMResponseAgent",
  "trace_id": "rag-457",
  "timestamp": "2025-01-30T10:30:00Z",
  "payload": {
    "retrieved_context": [
      "slide 3: revenue up 15% Q1",
      "doc: Q1 summary shows KPI improvements"
    ],
    "query": "What KPIs were tracked in Q1?",
    "confidence_scores": [0.92, 0.87]
  }
}
```

## Slide 4: System Workflow
1. **Document Upload**: User uploads multiple document types
2. **Ingestion**: IngestionAgent parses and chunks documents
3. **Query Processing**: User asks natural language question
4. **Retrieval**: RetrievalAgent searches vector database for relevant context
5. **Response Generation**: LLMResponseAgent creates final answer with sources
6. **Display**: Frontend shows response with agent trace and source documents

## Slide 5: Tech Stack & Features
**Frontend:**
- React + TypeScript + Tailwind CSS
- Real-time agent status monitoring
- Document upload with type validation
- Chat interface with source references

**Backend:**
- FastAPI with async processing
- Vector embeddings (OpenAI/HuggingFace)
- FAISS vector database
- Document parsers (PyPDF2, python-docx, etc.)

**Key Features:**
- Multi-agent communication via MCP
- Real-time processing visualization
- Source document attribution
- Extensible agent architecture

## Slide 6: Challenges & Future Improvements

**Challenges Faced:**
- Implementing efficient inter-agent communication
- Managing document parsing for multiple file types
- Optimizing vector search performance
- Creating intuitive real-time UI feedback

**Future Improvements:**
- Add support for more document types (images, audio)
- Implement persistent conversation history
- Add advanced retrieval strategies (hybrid search)
- Support for multi-modal document processing
- Enhanced agent orchestration with more specialized agents
- Integration with external knowledge bases