import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Bot, 
  Settings, 
  ExternalLink, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentTraceStep {
  agent: 'ingestion' | 'retrieval' | 'response';
  action: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  details?: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: string[];
  agentTrace?: AgentTraceStep[];
}

interface MessageBubbleProps {
  message: Message;
}

const getAgentColor = (agent: string) => {
  switch (agent) {
    case 'ingestion': return 'text-agent-ingestion';
    case 'retrieval': return 'text-agent-retrieval';
    case 'response': return 'text-agent-response';
    default: return 'text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-3 h-3 text-green-500" />;
    case 'running':
      return <Clock className="w-3 h-3 text-blue-500 animate-spin" />;
    case 'error':
      return <AlertCircle className="w-3 h-3 text-red-500" />;
    default:
      return <Clock className="w-3 h-3 text-muted-foreground" />;
  }
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  return (
    <div className={cn(
      "flex animate-message-slide",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] space-y-2",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message Header */}
        <div className={cn(
          "flex items-center space-x-2 text-xs text-muted-foreground",
          isUser ? "flex-row-reverse space-x-reverse" : ""
        )}>
          <div className="flex items-center space-x-1">
            {isUser ? (
              <User className="w-3 h-3" />
            ) : isSystem ? (
              <Settings className="w-3 h-3" />
            ) : (
              <Bot className="w-3 h-3" />
            )}
            <span>
              {isUser ? 'You' : isSystem ? 'System' : 'Assistant'}
            </span>
          </div>
          <span>{message.timestamp.toLocaleTimeString()}</span>
        </div>

        {/* Message Content */}
        <Card className={cn(
          "p-4 card-gradient",
          isUser && "chat-message-user",
          isSystem && "chat-message-system",
          !isUser && !isSystem && "chat-message-assistant"
        )}>
          <div className="space-y-3">
            <p className="text-sm leading-relaxed">{message.content}</p>

            {/* Sources */}
            {message.sources && message.sources.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium opacity-75">Sources:</p>
                <div className="flex flex-wrap gap-1">
                  {message.sources.map((source, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                    >
                      {source}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Agent Trace */}
            {message.agentTrace && message.agentTrace.length > 0 && (
              <div className="space-y-2 border-t border-border/50 pt-3">
                <p className="text-xs font-medium opacity-75">Agent Execution Trace:</p>
                <div className="space-y-2">
                  {message.agentTrace.map((step, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 rounded bg-background/50 border border-border/50"
                    >
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(step.status)}
                        <span className={cn("text-xs font-medium", getAgentColor(step.agent))}>
                          {step.agent}Agent
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {step.action}
                        </span>
                      </div>
                      {step.details && (
                        <span className="text-xs text-muted-foreground">
                          {step.details}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};