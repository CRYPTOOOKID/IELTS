import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  TerminalSquare, 
  ArrowLeft,
  FileText
} from 'lucide-react';

const ConversationSummary = ({ conversation, onBack }) => {
  // State for expanded message sections
  const [expandedMessages, setExpandedMessages] = useState({});

  // Toggle expansion of message details
  const toggleMessage = (messageId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  // Identify message type (user, assistant, or tool)
  const getMessageType = (message) => {
    if (message.type === 'tool_call' || message.type === 'tool_result') {
      return 'tool';
    }
    return message.role || 'unknown';
  };

  // Get icon for message type
  const getMessageIcon = (type) => {
    switch (type) {
      case 'user':
        return <MessageSquare size={18} className="text-blue-600" />;
      case 'assistant':
        return <MessageSquare size={18} className="text-green-600" />;
      case 'tool':
        return <TerminalSquare size={18} className="text-amber-600" />;
      default:
        return <FileText size={18} className="text-gray-600" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">Conversation Summary</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Button>
      </div>

      {/* Summary Overview */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Summary Overview</h3>
        <p className="text-gray-700">{conversation.summary || "No summary available"}</p>
      </div>

      {/* Message List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Conversation Details</h3>
        
        {conversation.messages.map((message, index) => {
          const messageType = getMessageType(message);
          const messageId = `message-${index}`;
          const isExpanded = expandedMessages[messageId];
          
          return (
            <div 
              key={messageId} 
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Message Header */}
              <div 
                className={`p-3 flex items-center justify-between cursor-pointer ${
                  messageType === 'user' 
                    ? 'bg-blue-50 hover:bg-blue-100' 
                    : messageType === 'assistant' 
                      ? 'bg-green-50 hover:bg-green-100' 
                      : 'bg-amber-50 hover:bg-amber-100'
                }`}
                onClick={() => toggleMessage(messageId)}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-white mr-3">
                    {getMessageIcon(messageType)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 capitalize">{messageType}</h4>
                    <p className="text-xs text-gray-500">
                      {message.timestamp 
                        ? new Date(message.timestamp).toLocaleString() 
                        : `Message ${index + 1}`}
                    </p>
                  </div>
                </div>
                <button className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-white/50 focus:outline-none">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              
              {/* Message Content */}
              {isExpanded && (
                <div className="p-4 bg-white border-t border-gray-200">
                  {messageType === 'tool' ? (
                    <div>
                      <div className="mb-2">
                        <span className="text-xs font-medium text-gray-500">Tool Name:</span>
                        <span className="ml-2 text-sm text-gray-800">{message.tool_name || "Unknown Tool"}</span>
                      </div>
                      
                      {message.parameters && (
                        <div className="mb-3">
                          <span className="text-xs font-medium text-gray-500">Parameters:</span>
                          <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                            {JSON.stringify(message.parameters, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {message.result && (
                        <div>
                          <span className="text-xs font-medium text-gray-500">Result:</span>
                          <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                            {typeof message.result === 'object' 
                              ? JSON.stringify(message.result, null, 2) 
                              : message.result}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-sm text-gray-700">
                      {message.content}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ConversationSummary; 