
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface ChatInputProps {
  input: string
  isLoading: boolean
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function ChatInput({
  input,
  isLoading,
  onChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <div className="border-t bg-card p-4">
      <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-center">
          <Input
            value={input}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Message Gemini..."
            disabled={isLoading}
            className="pr-12"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="absolute right-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Gemini may produce inaccurate information. Consider verifying important details.
        </p>
      </form>
    </div>
  )
}