import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_ACTIONS = [
  { label: 'Find products', message: 'Help me find products' },
  { label: 'How to sell', message: 'How do I become a seller?' },
  { label: 'Shipping info', message: 'Tell me about shipping and delivery' },
  { label: 'Returns', message: 'What is the return policy?' },
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          type: 'quick'
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content || data.error || 'Sorry, I could not respond.',
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI Assistant error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I\'m having trouble right now. Please try again or contact support@luxe.com.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-luxe-lg transition-all duration-300",
          "bg-luxe-gold text-primary-foreground hover:scale-105",
          isOpen && "rotate-90"
        )}
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-luxe-xl animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="bg-luxe-gold p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground">LUXE Assistant</h3>
                <p className="text-xs text-primary-foreground/80">Here to help you shop</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[320px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-sm text-foreground">
                    👋 Hi! I'm your LUXE shopping assistant. How can I help you today?
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Quick actions:</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => sendMessage(action.message)}
                        className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-full transition-colors text-foreground"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-2",
                    message.role === 'user' ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === 'user' ? "bg-luxe-gold" : "bg-secondary"
                  )}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-foreground" />
                    )}
                  </div>
                  <div className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.role === 'user' 
                      ? "bg-luxe-gold text-primary-foreground" 
                      : "bg-secondary text-foreground"
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-foreground" />
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" variant="luxe" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              AI assistant • Not a seller • For support: support@luxe.com
            </p>
          </form>
        </div>
      )}
    </>
  );
}
