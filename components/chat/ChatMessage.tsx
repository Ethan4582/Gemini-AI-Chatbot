"use client"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Copy, User } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { highlightSyntax } from "@/lib/code-highlight"
import { Message } from "@/types/chat"

export function ChatMessage({
  message,
  onCopy,
  onEditCode,
  editing,
}: {
  message: Message
  onCopy: (content: string) => void
  onEditCode: (code: string, lang: string, partIdx: number) => void
  editing: number | null
}) {
  function parseContent(content: string) {
    const cleanedContent = content.replace(/\*\*/g, '')
    const regex = /```(\w+)?\n([\s\S]*?)```/g
    let lastIndex = 0
    let match
    const parts: { type: "code" | "text"; lang?: string; value: string }[] = []

    while ((match = regex.exec(cleanedContent)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          value: cleanedContent.slice(lastIndex, match.index),
        })
      }
      parts.push({
        type: "code",
        lang: match[1] || 'plaintext',
        value: match[2].trim(),
      })
      lastIndex = regex.lastIndex
    }
    if (lastIndex < cleanedContent.length) {
      parts.push({
        type: "text",
        value: cleanedContent.slice(lastIndex),
      })
    }
    return parts
  }

  const parsed = parseContent(message.content)
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    onCopy(message.content);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleCopyCode = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex gap-3",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-3 max-w-[80%] flex items-start gap-3",
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        {message.role === "assistant" && (
          <Avatar className="h-6 w-6 mt-1">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 space-y-3 relative">
          
          <button
            className="absolute top-0 right-0 text-zinc-400 hover:text-zinc-200 transition p-1"
            onClick={handleCopyMessage}
            title="Copy message"
          >
            {copiedMsg ? (
              <span className="text-xs">Copied!</span>
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          {parsed.map((part, idx) => {
            if (part.type === "code" && editing === idx) {
              return null
            }
            
            if (part.type === "code") {
              return (
                <div key={idx} className="relative group">
                  <div className="flex items-center justify-between bg-zinc-800 rounded-t-md px-4 py-2">
                    <span className="text-xs text-zinc-400">
                      {part.lang || 'code'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="text-xs text-zinc-400 hover:text-zinc-200 transition"
                        onClick={() => onEditCode(part.value, part.lang || "plaintext", idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-zinc-400 hover:text-zinc-200 transition"
                        onClick={() => handleCopyCode(part.value, idx)}
                        title="Copy code"
                      >
                        {copiedIndex === idx ? (
                          <span className="text-xs">Copied!</span>
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-b-md overflow-x-auto">
                    <code
                      dangerouslySetInnerHTML={{
                        __html: highlightSyntax(part.value, part.lang || 'plaintext')
                      }}
                    />
                  </pre>
                </div>
              )
            }
            return (
              <div 
                key={idx} 
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: part.value.replace(/\n/g, '<br />') }}
              />
            )
          })}
          <div className="text-xs mt-1 opacity-70">
            {message.timestamp
              ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : ""}
          </div>
        </div>
        {message.role === "user" && (
          <Avatar className="h-6 w-6 mt-1">
            <AvatarImage src="" />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </motion.div>
  )
}

export function StreamingMessage({ content }: { content: string }) {
 
  const cleanedContent = content
    .replace(/\*\*/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    
    .replace(/\[DONE\]$/, '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 justify-start"
    >
      <div className="rounded-lg px-4 py-3 max-w-[80%] bg-muted flex items-start gap-3">
        <Avatar className="h-6 w-6 mt-1">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="whitespace-pre-wrap">
            {cleanedContent}
            <span className="inline-block ml-1 h-5 w-2 bg-muted-foreground animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}