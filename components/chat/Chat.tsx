"use client"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { toast } from "@/hooks/use-toast"
import { Sidebar } from "@/components/chat/Sidebar"
import { ChatHeader } from "@/components/chat/ChatHeader"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatSession, Message } from "@/types/chat"
import { Spinner } from "@/components/ui/spinner"


export default function Chat() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chat-sessions")
      if (saved) return JSON.parse(saved)
    }
    return [{ id: "default", name: "New Chat", messages: [] }]
  })
  
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    if (typeof window !== "undefined" && chatSessions[0]?.id) {
      return chatSessions[0].id
    }
    return "default"
  })
  
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState("")
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()


  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chat-sessions", JSON.stringify(chatSessions))
    }
  }, [chatSessions])

  const activeSession = chatSessions.find((s) => s.id === activeSessionId) || chatSessions[0]
  const messages = activeSession.messages

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        }
      }
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!input.trim() || isLoading) return

  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: input.trim(),
    timestamp: new Date(),
  }

  updateSessionMessages([...messages, userMessage])
  setInput("")
  setIsLoading(true)
  setStreamingMessage("")
  setError(null)

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    if (!response.body) throw new Error("No response body")

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let assistantMessage = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
    
      const cleanedChunk = chunk.startsWith("data: ") ? chunk.slice(6) : chunk
      assistantMessage += cleanedChunk
      setStreamingMessage(assistantMessage)
    }

    const assistantMessageObj: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: assistantMessage,
      timestamp: new Date(),
    }
    
    updateSessionMessages([...messages, userMessage, assistantMessageObj])
    setStreamingMessage("")
  } catch (error) {
    setError("Failed to get response from AI. Please try again.")
    toast({
      title: "Error",
      description: "Failed to get response from AI. Please try again.",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }
}

  const updateSessionMessages = (newMessages: Message[]) => {
    setChatSessions(prev => prev.map(s => 
      s.id === activeSessionId ? { ...s, messages: newMessages } : s
    ))
  }

  const handleUpdateMessage = (messageId: string, newContent: string) => {
    setChatSessions(prev =>
      prev.map(session =>
        session.id === activeSessionId
          ? {
              ...session,
              messages: session.messages.map(msg =>
                msg.id === messageId ? { ...msg, content: newContent } : msg
              ),
            }
          : session
      )
    )
  }

  const clearChat = () => {
    updateSessionMessages([])
    setStreamingMessage("")
    toast({
      title: "Chat cleared",
      description: "Your conversation has been reset",
    })
  }

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      })
    }
  }

  const handleNewChat = () => {
    const newId = Date.now().toString()
    setChatSessions(prev => [
      { id: newId, name: `Chat ${prev.length + 1}`, messages: [] },
      ...prev
    ])
    setActiveSessionId(newId)
  }

  const handleSelectChat = (id: string) => {
    setActiveSessionId(id)
  }

  const handleDeleteChat = (id: string) => {
    setChatSessions(prev => {
      const filtered = prev.filter(s => s.id !== id)
      if (id === activeSessionId && filtered.length > 0) {
        setActiveSessionId(filtered[0].id)
      }
      return filtered.length > 0 ? filtered : [{ id: "default", name: "New Chat", messages: [] }]
    })
  }

  const handleSetExample = (example: string) => {
    setInput(example)
  }

  const handleRenameChat = (id: string, newName: string) => {
    setChatSessions(prev =>
      prev.map(session =>
        session.id === id ? { ...session, name: newName } : session
      )
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 relative">
    
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(93,95,239,0.1),rgba(0,0,0,0))]" />
      </div>
      
     
      <Sidebar
        chatSessions={chatSessions}
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />

      
      <div className="flex-1 flex flex-col min-h-0 z-10">
        <ChatHeader
          title={activeSession.name}
          hasMessages={messages.length > 0 || !!streamingMessage}
          onClearChat={clearChat}
          onNewChat={handleNewChat}
        />

        <div className="flex-1 min-h-0 flex flex-col">
          <ChatMessages
            messages={messages}
            streamingMessage={streamingMessage}
            isLoading={isLoading}
            onCopyMessage={copyMessage}
            onSetExample={handleSetExample}
            onUpdateMessage={handleUpdateMessage} 
          />
        </div>

        <ChatInput
          input={input}
          isLoading={isLoading}
          onChange={setInput}
          onSubmit={handleSubmit}
        />

        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Spinner />
            <span className="ml-2 text-muted-foreground">Waiting for AI response...</span>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center py-2">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}