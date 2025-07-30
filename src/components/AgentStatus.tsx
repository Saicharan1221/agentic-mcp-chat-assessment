import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Search, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentStatusProps {
  activeAgents: string[];
}

const AGENT_INFO = {
  ingestion: {
    name: 'IngestionAgent',
    icon: Brain,
    description: 'Parsing & chunking documents',
    color: 'agent-ingestion'
  },
  retrieval: {
    name: 'RetrievalAgent', 
    icon: Search,
    description: 'Vector search & context retrieval',
    color: 'agent-retrieval'
  },
  response: {
    name: 'LLMResponseAgent',
    icon: MessageSquare,
    description: 'Generating final response',
    color: 'agent-response'
  }
};

export const AgentStatus: React.FC<AgentStatusProps> = ({ activeAgents }) => {
  const getStatusIcon = (agentKey: string) => {
    if (activeAgents.includes(agentKey)) {
      return <Clock className="w-4 h-4 animate-spin" />;
    }
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusBadge = (agentKey: string) => {
    if (activeAgents.includes(agentKey)) {
      return (
        <Badge variant="secondary" className="animate-pulse">
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        Idle
      </Badge>
    );
  };

  return (
    <Card className="p-4 card-gradient">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <Zap className="w-4 h-4 mr-2 text-primary" />
            Agent Status
          </h3>
          {activeAgents.length > 0 && (
            <Badge variant="secondary" className="animate-pulse">
              {activeAgents.length} Running
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {Object.entries(AGENT_INFO).map(([key, agent]) => {
            const IconComponent = agent.icon;
            const isActive = activeAgents.includes(key);
            
            return (
              <div 
                key={key}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-smooth",
                  isActive ? "border-primary/50 bg-primary/5" : "border-border/50"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isActive ? "animate-pulse-glow" : "",
                    key === 'ingestion' && "bg-agent-ingestion/10 border border-agent-ingestion/20",
                    key === 'retrieval' && "bg-agent-retrieval/10 border border-agent-retrieval/20", 
                    key === 'response' && "bg-agent-response/10 border border-agent-response/20"
                  )}>
                    <IconComponent className={cn(
                      "w-4 h-4",
                      key === 'ingestion' && "text-agent-ingestion",
                      key === 'retrieval' && "text-agent-retrieval",
                      key === 'response' && "text-agent-response"
                    )} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(key)}
                  {getStatusBadge(key)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>MCP Protocol</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};