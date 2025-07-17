
"use client"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot } from "lucide-react"

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