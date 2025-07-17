"use client"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

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
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center justify-between border-b px-4 py-2 bg-background/80 backdrop-blur-sm">
      <div className="font-semibold text-lg truncate">{title}</div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onClearChat}
          disabled={!hasMessages}
        >
          Clear Chat
        </Button>
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  )
}