"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "./ChatMessage"
import { StreamingMessage } from "./StreamingMessage"
import { LoadingIndicator } from "./LoadingIndicator"
import { WelcomeMessage } from "./WelcomeMessage"
import { Message } from "@/types/chat"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ChatMessagesProps {
  messages: Message[]
  streamingMessage: string
  isLoading: boolean
  onCopyMessage: (content: string) => void
  onSetExample: (example: string) => void
  onUpdateMessage: (messageId: string, newContent: string) => void
}

export function ChatMessages({
  messages,
  streamingMessage,
  isLoading,
  onCopyMessage,
  onSetExample,
  onUpdateMessage,
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
    if (editing) {
    
      const msg = messages.find(m => m.id === editing.messageId)
      if (msg) {
       
        const parts = parseContent(msg.content)
       
        parts[editing.partIdx] = {
          ...parts[editing.partIdx],
          value: codeEditorRef.current?.value || editing.code,
        }
      
        const newContent = parts.map(part =>
          part.type === "code"
            ? `\`\`\`${part.lang || ""}\n${part.value}\`\`\``
            : part.value
        ).join("")
      
        onUpdateMessage(editing.messageId, newContent)
      }
      setEditing(null)
    }
  }

  return (
    <div className="flex h-full w-full relative">
     
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
                  {expanded ? "Minimize" : "Expand"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(null)}
                  className="text-white hover:bg-zinc-700"
                >
                  Close
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

function parseContent(content: string) {
 
  return [
    {
      type: "text",
      value: "Hello, this is a message.",
    },
    {
      type: "code",
      lang: "javascript",
      value: "console.log('Hello, world!');",
    },
    {
      type: "text",
      value: "This is another message.",
    },
  ]
}