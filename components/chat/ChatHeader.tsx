"use client"
import { Button } from "@/components/ui/button"
import { Bot, Plus, Trash2 } from "lucide-react"
import { ChatSession } from "@/types/chat"

interface ChatHeaderProps {
  title: string
  hasMessages: boolean
  onClearChat: () => void
  onNewChat: () => void
}

export function ChatHeader({
  title,
  hasMessages,
  onClearChat,
  onNewChat,
}: ChatHeaderProps) {
  return (
    <div className="border-b bg-card">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearChat}
            disabled={!hasMessages}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNewChat}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>
    </div>
  )
}