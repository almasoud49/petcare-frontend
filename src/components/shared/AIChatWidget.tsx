import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  PawPrint,
  Calendar,
  ShoppingBag,
  Stethoscope,
  Minimize2,
  RotateCcw,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

const quickActions = [
  {
    icon: Calendar,
    label: 'Book a grooming session',
    prompt: 'I want to book a grooming session for my dog. What do you offer?',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    icon: ShoppingBag,
    label: 'Recommend food for my cat',
    prompt: 'What food would you recommend for a 2-year-old Persian cat?',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/30',
  },
  {
    icon: Stethoscope,
    label: 'Find an emergency vet',
    prompt: 'I need to find a 24/7 emergency vet near Gulshan.',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/30',
  },
  {
    icon: PawPrint,
    label: 'Track my order',
    prompt: 'How can I track my recent order?',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/30',
  },
];

const SESSION_KEY = 'petcare-ai-session';

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi there! 👋 I'm your PetCare Assistant. I can help you book services, find products, track orders, or answer any pet care questions. What can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persistent session id
  const sessionId = useRef(
    (() => {
      let id = localStorage.getItem(SESSION_KEY);
      if (!id) {
        id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem(SESSION_KEY, id);
      }
      return id;
    })()
  ).current;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, loading]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, minimized]);

  const send = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setMessages((m) => [
      ...m,
      { role: 'user', content: messageText, timestamp: new Date() },
    ]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', {
        sessionId,
        message: messageText,
      });
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.data.reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            "Sorry, I'm having trouble connecting right now. Please try again or call us at +880 1712 345678.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Hi there! 👋 I'm your PetCare Assistant. What can I help you with?",
        timestamp: new Date(),
      },
    ]);
    localStorage.removeItem(SESSION_KEY);
  };

  const formatTime = (d?: Date) =>
    d
      ? d.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      : '';

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        className={`fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center ${
          open ? 'hidden' : ''
        }`}
        aria-label="Open Pet Care Assistant"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-background animate-pulse" />
      </button>

      {/* Chat window */}
      {open && (
        <div
          className={`fixed z-50 bg-background rounded-2xl shadow-2xl border overflow-hidden flex flex-col transition-all duration-200 ${
            minimized
              ? 'bottom-6 right-6 w-72 h-14'
              : 'bottom-6 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-3rem)]'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center gap-3 p-4 bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shrink-0 ${
              minimized ? 'cursor-pointer' : ''
            }`}
            onClick={() => minimized && setMinimized(false)}
          >
            <div className="relative shrink-0">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <PawPrint className="h-5 w-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm">PetCare Assistant</p>
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs opacity-90">
                {loading ? 'Typing...' : 'Online · Replies instantly'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimized(!minimized);
                }}
                className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition"
                aria-label="Minimize"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!minimized && (
            <>
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20"
              >
                {/* Quick actions — only when 1 message */}
                {messages.length === 1 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground px-1">
                      Suggested
                    </p>
                    {quickActions.map((a) => (
                      <button
                        key={a.label}
                        onClick={() => send(a.prompt)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border bg-card hover:border-primary/40 hover:shadow-sm transition text-left group"
                      >
                        <div
                          className={`h-9 w-9 rounded-lg ${a.bg} flex items-center justify-center shrink-0`}
                        >
                          <a.icon className={`h-4 w-4 ${a.color}`} />
                        </div>
                        <span className="text-sm font-medium flex-1 group-hover:text-primary transition">
                          {a.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Chat messages */}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 ${
                      m.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {m.role === 'assistant' && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <PawPrint className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-card border rounded-tl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.content}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          m.role === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {formatTime(m.timestamp)}
                      </p>
                    </div>
                    {m.role === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex gap-2 justify-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <PawPrint className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-card border rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                        <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                        <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t bg-background">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                  className="flex gap-2 items-center"
                >
                  <Input
                    ref={inputRef}
                    placeholder="Ask anything about your pet..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={loading || !input.trim()}
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <div className="flex items-center justify-between mt-2 px-1">
                  <button
                    onClick={reset}
                    className="text-[11px] text-muted-foreground hover:text-primary transition flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Start over
                  </button>
                  <Badge variant="secondary" className="text-[10px] py-0 h-5">
                    Powered by AI
                  </Badge>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}