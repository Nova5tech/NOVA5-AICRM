'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, Terminal, ArrowRight, UserCheck } from 'lucide-react';
import { api } from '@/lib/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  toolCalls?: any[];
  data?: any;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      content: 'Hello Alex! I am your Nova5 AI CRM Assistant. You can ask me natural-language questions like:\n• "Show me all high-priority leads"\n• "Which deals are at risk in our pipeline?"\n• "Summarize recent WhatsApp conversations"\n• "Give me an executive analytics summary"',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend(queryText?: string) {
    const text = queryText || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await api.queryCopilot(text);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: res.answer,
        toolCalls: res.tool_calls,
        data: res.data,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: 'assistant', content: 'Apologies, I encountered an issue retrieving CRM records.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 animate-fade-in relative z-10">
      <div className="pb-3 border-b border-white/60 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-purple-600" /> Conversational AI Assistant & Copilot Agent
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Operate your CRM using grounded tool function execution.</p>
        </div>
      </div>

      {/* Chat History Window */}
      <div className="flex-1 light-glass-card rounded-2xl p-4 overflow-y-auto space-y-4 shadow-sky-glass">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1 text-[11px] font-bold text-slate-700">
              {msg.sender === 'assistant' ? (
                <span className="flex items-center gap-1.5 text-purple-700"><Bot className="w-3.5 h-3.5" /> AI Copilot</span>
              ) : (
                <span>Alex Vance</span>
              )}
            </div>

            <div className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed font-medium ${msg.sender === 'user' ? 'bg-vibrant-sky-gradient text-white rounded-tr-none shadow-sky-glow font-semibold' : 'bg-white/90 border border-sky-200 text-slate-900 rounded-tl-none space-y-3 shadow-sm'}`}>
              <div className="whitespace-pre-line">{msg.content}</div>

              {/* Display Tool Execution Log */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 font-mono text-[10px] text-sky-900 space-y-1">
                  <div className="font-extrabold flex items-center gap-1 text-slate-700"><Terminal className="w-3 h-3 text-sky-600" /> Executed Function Call:</div>
                  {msg.toolCalls.map((tc, idx) => (
                    <div key={idx} className="font-semibold">&gt; {tc.tool}({JSON.stringify(tc.args)})</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-sky-800 font-bold animate-pulse font-mono">
            <Sparkles className="w-4 h-4 text-sky-600" /> Analyzing CRM database & selecting appropriate tools...
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto text-xs py-1">
        {[
          'Show me all high-priority leads',
          'Which deals are at risk in our pipeline?',
          'Summarize recent WhatsApp conversations',
          'Give me an executive analytics summary',
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3.5 py-1.5 rounded-xl bg-white/80 border border-sky-200 hover:border-sky-400 hover:bg-white text-slate-800 font-bold text-xs shrink-0 whitespace-nowrap shadow-sm transition-all duration-75"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-3 light-glass-card rounded-2xl flex gap-2 shadow-sky-glass">
        <input
          type="text"
          placeholder="Ask AI Copilot anything about your leads, deals, or conversations..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2.5 rounded-xl light-glass-input text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          className="px-5 py-2.5 rounded-xl bg-vibrant-sky-gradient text-white font-bold text-xs shadow-sky-glow hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Send className="w-3.5 h-3.5" /> Ask Copilot
        </button>
      </div>
    </div>
  );
}
