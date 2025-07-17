"use client"

import { Button } from "@/components/ui/button"



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
    <div className="border-t bg-background/80 backdrop-blur-sm p-4">
      <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}