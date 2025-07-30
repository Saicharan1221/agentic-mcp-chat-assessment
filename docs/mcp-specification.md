# Model Context Protocol (MCP) Specification

## Overview
The Model Context Protocol (MCP) is a structured communication framework for inter-agent message passing in the Agentic RAG system. It provides standardized message formats, routing, and tracing capabilities.

## Message Structure

### Base Message Format
```typescript
interface MCPMessage {
  type: string;                    // Message type identifier
  sender: string;                  // Sending agent identifier
  receiver: string;                // Target agent identifier
  trace_id: string;               // Unique trace identifier
  timestamp: string;              // ISO 8601 timestamp
  payload: Record<string, any>;   // Message-specific data
  metadata?: Record<string, any>; // Optional metadata
}
```

## Message Types

### 1. DOCUMENT_INGESTION
**Sender**: IngestionAgent  
**Receiver**: System/RetrievalAgent

```json
{
  "type": "DOCUMENT_INGESTION",
  "sender": "IngestionAgent",
  "receiver": "RetrievalAgent",
  "trace_id": "ing-001",
  "timestamp": "2025-01-30T10:30:00Z",
  "payload": {
    "document_id": "doc_123",
    "document_name": "sales_report.pdf",
    "chunks": [
      {
        "chunk_id": "chunk_001",
        "content": "Q1 revenue increased by 15%...",
        "metadata": {
          "page": 1,
          "section": "Executive Summary"
        }
      }
    ],
    "embedding_model": "text-embedding-ada-002",
    "total_chunks": 45
  }
}
```

### 2. RETRIEVAL_REQUEST
**Sender**: System  
**Receiver**: RetrievalAgent

```json
{
  "type": "RETRIEVAL_REQUEST",
  "sender": "System",
  "receiver": "RetrievalAgent", 
  "trace_id": "ret-002",
  "timestamp": "2025-01-30T10:31:00Z",
  "payload": {
    "query": "What KPIs were tracked in Q1?",
    "top_k": 5,
    "similarity_threshold": 0.7,
    "filters": {
      "document_types": ["pdf", "csv"],
      "date_range": ["2024-01-01", "2024-03-31"]
    }
  }
}
```

### 3. RETRIEVAL_RESULT
**Sender**: RetrievalAgent  
**Receiver**: LLMResponseAgent

```json
{
  "type": "RETRIEVAL_RESULT",
  "sender": "RetrievalAgent",
  "receiver": "LLMResponseAgent",
  "trace_id": "ret-002",
  "timestamp": "2025-01-30T10:31:15Z",
  "payload": {
    "query": "What KPIs were tracked in Q1?",
    "retrieved_chunks": [
      {
        "chunk_id": "chunk_015",
        "content": "Key Performance Indicators for Q1 include: Revenue Growth (15%), Customer Acquisition (120%), Market Share (8.5%)",
        "similarity_score": 0.92,
        "source_document": "sales_report.pdf",
        "metadata": {
          "page": 3,
          "section": "KPI Dashboard"
        }
      }
    ],
    "total_results": 5,
    "search_duration_ms": 150
  }
}
```

### 4. RESPONSE_REQUEST
**Sender**: System  
**Receiver**: LLMResponseAgent

```json
{
  "type": "RESPONSE_REQUEST",
  "sender": "System",
  "receiver": "LLMResponseAgent",
  "trace_id": "llm-003",
  "timestamp": "2025-01-30T10:31:20Z",
  "payload": {
    "user_query": "What KPIs were tracked in Q1?",
    "context_chunks": [
      {
        "content": "Key Performance Indicators for Q1...",
        "source": "sales_report.pdf"
      }
    ],
    "conversation_history": [],
    "generation_params": {
      "model": "gpt-4",
      "max_tokens": 2000,
      "temperature": 0.7
    }
  }
}
```

### 5. RESPONSE_RESULT
**Sender**: LLMResponseAgent  
**Receiver**: System

```json
{
  "type": "RESPONSE_RESULT", 
  "sender": "LLMResponseAgent",
  "receiver": "System",
  "trace_id": "llm-003",
  "timestamp": "2025-01-30T10:31:45Z",
  "payload": {
    "response": "Based on the Q1 sales report, the following KPIs were tracked: Revenue Growth at 15%, Customer Acquisition at 120 new customers, and Market Share at 8.5%. These metrics indicate strong performance across all key areas.",
    "source_documents": ["sales_report.pdf", "kpi_metrics.csv"],
    "confidence_score": 0.89,
    "tokens_used": 1250,
    "generation_time_ms": 2500
  }
}
```

### 6. ERROR_MESSAGE
**Sender**: Any Agent  
**Receiver**: System

```json
{
  "type": "ERROR_MESSAGE",
  "sender": "RetrievalAgent",
  "receiver": "System",
  "trace_id": "err-001", 
  "timestamp": "2025-01-30T10:32:00Z",
  "payload": {
    "error_code": "VECTOR_SEARCH_FAILED",
    "error_message": "Vector database connection timeout",
    "original_request": {
      "type": "RETRIEVAL_REQUEST",
      "trace_id": "ret-002"
    },
    "retry_possible": true,
    "suggested_action": "Retry with reduced timeout"
  }
}
```

## Agent Identifiers

### Standard Agent IDs
- `IngestionAgent` - Document processing and chunking
- `RetrievalAgent` - Vector search and context retrieval  
- `LLMResponseAgent` - Response generation
- `System` - System coordinator and UI interface

### Custom Agent Extensions
```typescript
interface AgentRegistration {
  agent_id: string;
  agent_type: string;
  capabilities: string[];
  message_types: string[];
  status: 'active' | 'inactive' | 'error';
}
```

## Trace Management

### Trace ID Format
```
<agent_prefix>-<timestamp>-<sequence>
Examples:
- ing-20250130-001 (Ingestion)
- ret-20250130-002 (Retrieval)  
- llm-20250130-003 (LLM Response)
```

### Trace Correlation
All messages in a conversation thread share the same base trace ID with suffixes:
```
rag-conversation-123
├── ing-rag-conversation-123-001
├── ret-rag-conversation-123-002
└── llm-rag-conversation-123-003
```

## Protocol Implementation

### Message Router
```python
class MCPRouter:
    def __init__(self):
        self.agents = {}
        self.message_queue = asyncio.Queue()
        self.trace_store = {}
    
    async def register_agent(self, agent_id: str, agent_instance):
        self.agents[agent_id] = agent_instance
    
    async def send_message(self, message: MCPMessage):
        # Validate message format
        # Route to target agent
        # Store trace information
        # Handle errors and retries
```

### Agent Base Class
```python
class MCPAgent:
    def __init__(self, agent_id: str, router: MCPRouter):
        self.agent_id = agent_id
        self.router = router
        self.message_handlers = {}
    
    async def handle_message(self, message: MCPMessage):
        handler = self.message_handlers.get(message.type)
        if handler:
            return await handler(message)
        else:
            return self.create_error_message("UNKNOWN_MESSAGE_TYPE")
    
    def create_message(self, msg_type: str, receiver: str, payload: dict) -> MCPMessage:
        return MCPMessage(
            type=msg_type,
            sender=self.agent_id,
            receiver=receiver,
            trace_id=self.generate_trace_id(),
            timestamp=datetime.utcnow().isoformat(),
            payload=payload
        )
```

## Monitoring and Debugging

### Message Tracing
- All messages are logged with full payload
- Trace visualization in UI
- Performance metrics tracking
- Error correlation and analysis

### Agent Health Monitoring
```json
{
  "agent_id": "RetrievalAgent",
  "status": "active",
  "last_heartbeat": "2025-01-30T10:35:00Z",
  "messages_processed": 1547,
  "average_response_time_ms": 250,
  "error_rate": 0.02
}
```

## Security Considerations

### Message Validation
- Schema validation for all message types
- Agent authentication and authorization
- Payload sanitization and size limits
- Rate limiting per agent

### Data Privacy
- Sensitive data masking in logs
- Secure message transport (TLS)
- Audit trail for compliance
- Data retention policies

## Extensions and Customization

### Custom Message Types
Developers can extend the protocol with custom message types:

```python
@dataclass
class CustomAnalysisMessage(MCPMessage):
    type: str = "CUSTOM_ANALYSIS"
    payload: Dict[str, Any] = field(default_factory=lambda: {
        "analysis_type": "",
        "parameters": {},
        "expected_output": ""
    })
```

### Plugin Architecture
The MCP supports plugins for extending functionality:
- Custom routing logic
- Message transformation middleware
- External system integrations
- Advanced monitoring and analytics