"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Copy, User, Maximize2, Minimize2, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Message } from "@/types/chat"
import { useState, useRef, useEffect } from "react"
import { highlightSyntax } from "@/lib/code-highlight"

interface ChatMessagesProps {
  messages: Message[]
  streamingMessage: string
  isLoading: boolean
  onCopyMessage: (content: string) => void
  onSetExample: (example: string) => void 
}

export function ChatMessages({
  messages,
  streamingMessage,
  isLoading,
  onCopyMessage,
  onSetExample, 
}: ChatMessagesProps) {
  const [editing, setEditing] = useState<{
    messageId: string
    code: string
    lang: string
    partIdx: number
  } | null>(null)
  const [expanded, setExpanded] = useState(false)
  const codeEditorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing && codeEditorRef.current) {
      codeEditorRef.current.focus()
    }
  }, [editing])

  const handleSave = () => {
    setEditing(null)
  }

  return (
    <div className="flex h-full w-full relative">
      {/* Main chat area - adjusts width when editor is open */}
      <motion.div
        className="h-full flex-shrink-0 overflow-hidden"
        animate={{
          width: editing ? (expanded ? "0%" : "42%") : "100%"
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <ScrollArea className="h-full p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && !streamingMessage && (
              <WelcomeMessage onSetExample={onSetExample} />
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  onCopy={onCopyMessage}
                  onEditCode={(code, lang, partIdx) =>
                    setEditing({ messageId: msg.id, code, lang, partIdx })
                  }
                  editing={editing && editing.messageId === msg.id ? editing.partIdx : null}
                />
              ))}

              {streamingMessage && (
                <StreamingMessage content={streamingMessage} />
              )}

              {isLoading && !streamingMessage && (
                <LoadingIndicator />
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </motion.div>

      {/* Side code editor */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: expanded ? "100vw" : "55%",
              opacity: 1
            }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={cn(
              "h-full border-l border-border bg-zinc-900 flex flex-col overflow-hidden z-10",
              expanded ? "fixed top-0 left-0 w-screen" : "absolute right-0"
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-border bg-zinc-800">
              <span className="text-sm text-zinc-200 font-mono">
                {editing.lang || "code"}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded((v) => !v)}
                  title={expanded ? "Minimize" : "Expand"}
                  className="text-white hover:bg-zinc-700"
                >
                  {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(null)}
                  className="text-white hover:bg-zinc-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <textarea
              ref={codeEditorRef}
              defaultValue={editing.code}
              className="flex-1 w-full bg-zinc-900 text-zinc-100 p-4 font-mono text-sm outline-none resize-none"
              spellCheck={false}
            />
            <div className="p-4 border-t border-border flex justify-end gap-2 bg-zinc-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(null)}
                className="text-white border-zinc-600 hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ChatMessage({
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
    // Remove "**" from the content
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
          {/* Copy button for the whole message */}
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

function StreamingMessage({ content }: { content: string }) {
  // Clean up the content by removing line breaks, extra spaces, and "**"
  const cleanedContent = content
    .replace(/\*\*/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    // Remove "[DONE]" if present
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

function LoadingIndicator() {
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
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-75" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function WelcomeMessage({ onSetExample }: { onSetExample: (example: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground">
      <Bot className="h-12 w-12 mb-4" />
      <h2 className="text-xl font-medium">How can I help you today?</h2>
      <p className="mt-2">Ask me anything or try one of these examples:</p>
      <div className="mt-4 grid grid-cols-1 gap-2 w-full max-w-md">
        <Button
          variant="outline"
          className="h-auto py-2 justify-start text-left"
          onClick={() => onSetExample("Give BFS code in C++")}
        >
          Give BFS code in C++ 
        </Button>
        <Button
          variant="outline"
          className="h-auto py-2 justify-start text-left"
          onClick={() => onSetExample("Write a Python function to calculate Fibonacci sequence")}
        >
          Write a Python function to calculate Fibonacci sequence
        </Button>
        <Button
          variant="outline"
          className="h-auto py-2 justify-start text-left"
          onClick={() => onSetExample("How do I implement authentication in Next.js?")}
        >
          How do I implement authentication in Next.js?
        </Button>
      </div>
    </div>
  )
}