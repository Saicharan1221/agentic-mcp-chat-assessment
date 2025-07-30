import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Upload, 
  Bot, 
  User, 
  Settings, 
  FileText,
  Brain,
  Search,
  MessageSquare,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileUploader } from './FileUploader';
import { AgentStatus } from './AgentStatus';
import { MessageBubble } from './MessageBubble';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: string[];
  agentTrace?: AgentTraceStep[];
}

interface AgentTraceStep {
  agent: 'ingestion' | 'retrieval' | 'response';
  action: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  details?: string;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to the Agentic RAG Chatbot! Upload documents and start asking questions. The system uses three intelligent agents to process your queries.',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    setActiveAgents(['ingestion', 'retrieval', 'response']);

    // Simulate agent processing
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Based on the uploaded documents, I can provide insights about your query: "${inputValue}". The agents have processed your request through the MCP protocol and retrieved relevant context.`,
        timestamp: new Date(),
        sources: uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name) : undefined,
        agentTrace: [
          { agent: 'ingestion', action: 'Document parsing completed', status: 'completed' },
          { agent: 'retrieval', action: 'Vector search executed', status: 'completed', details: '3 relevant chunks found' },
          { agent: 'response', action: 'LLM response generated', status: 'completed' }
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
      setActiveAgents([]);
    }, 3000);
  };

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    
    const systemMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: `✅ Uploaded ${files.length} file(s): ${files.map(f => f.name).join(', ')}. Documents are being processed by the IngestionAgent.`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border card-gradient p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Agentic RAG</h2>
              <p className="text-sm text-muted-foreground">Model Context Protocol</p>
            </div>
          </div>

          <FileUploader onFilesUpload={handleFileUpload} />
          
          {uploadedFiles.length > 0 && (
            <Card className="p-4 card-gradient">
              <h3 className="font-semibold mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Uploaded Documents ({uploadedFiles.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="truncate">{file.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(file.size / 1024).toFixed(1)}KB
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <AgentStatus activeAgents={activeAgents} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 card-gradient">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-lg font-semibold">RAG Assistant</h1>
                <p className="text-sm text-muted-foreground">
                  {isProcessing ? 'Processing with MCP agents...' : 'Ready to answer your questions'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="max-w-sm">
                  <Card className="p-4 card-gradient">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Agents are thinking...</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border p-4 card-gradient">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your documents..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isProcessing}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isProcessing || !inputValue.trim()}
                className="glow-effect"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Powered by MCP • {uploadedFiles.length} documents loaded</span>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  3 Agents Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};