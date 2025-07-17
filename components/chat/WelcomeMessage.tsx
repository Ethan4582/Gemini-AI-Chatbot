"use client"
import { Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function WelcomeMessage({ onSetExample }: { onSetExample: (example: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-border mb-6"
      >
        <Sparkles className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Powered by Gemini 1.5 Flash</span>
      </motion.div>
      <Bot className="h-12 w-12 mb-4" />
      <h2 className="text-xl font-medium mb-4">How can I help you today?</h2>
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