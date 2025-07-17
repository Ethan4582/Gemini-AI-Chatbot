"use client"
import { ChatSession } from "@/types/chat"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { Sheet, SheetContent } from "../ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarProps {
  chatSessions: ChatSession[]
  activeSessionId: string
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  onRenameChat: (id: string, newName: string) => void
}

export function Sidebar({
  chatSessions,
  activeSessionId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
}: SidebarProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)

  const isMobile = useIsMobile()


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        setIsCollapsed(!isCollapsed)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCollapsed])

  const handleRename = (id: string, currentName: string) => {
    setRenamingId(id)
    setNewName(currentName)
  }

  const saveRename = (id: string) => {
    if (newName.trim()) {
      onRenameChat(id, newName.trim())
      setRenamingId(null)
      toast({
        title: "Chat renamed",
        description: "The chat session has been updated",
      })
    }
  }

  return isMobile ? (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent>
        <div 
          className={`relative h-full flex flex-col transition-all duration-300 ease-in-out ${
            isCollapsed ? "w-12" : "w-64"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          



          <button
            className="absolute -right-3 top-4 z-20 h-6 w-6 rounded-full border bg-background flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          <div className={`border-r bg-card h-full flex flex-col overflow-hidden ${
            isCollapsed ? "border-r-0" : ""
          }`}>
            <div className="p-4 border-b">
              {isCollapsed ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-full" 
                  onClick={onNewChat}
                  title="New Chat"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              ) : (
                <Button className="w-full" onClick={onNewChat}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative rounded-md p-2 mb-1 cursor-pointer transition-colors border ${
                    session.id === activeSessionId
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  } ${isCollapsed ? "flex justify-center" : ""}`}
                  onClick={() => onSelectChat(session.id)}
                >
                  {renamingId === session.id && !isCollapsed ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none"
                        autoFocus
                        onBlur={() => saveRename(session.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename(session.id)
                          if (e.key === "Escape") setRenamingId(null)
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`flex items-center justify-between w-full ${
                      isCollapsed ? "justify-center" : ""
                    }`}>
                      {isCollapsed ? (
                        <span className="text-sm truncate" title={session.name}>
                          {session.name.charAt(0)}
                        </span>
                      ) : (
                        <>
                          <span className="truncate text-sm">{session.name}</span>
                          <div className={`flex opacity-0 group-hover:opacity-100 transition ${
                            isCollapsed ? "hidden" : ""
                          }`}>
                            <button
                              className="p-1 hover:bg-muted-foreground/10 rounded"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRename(session.id, session.name)
                              }}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="p-1 hover:bg-muted-foreground/10 rounded"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteChat(session.id)
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <div 
      className={`relative h-full flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-12" : "w-64"
      }`}
    >
      <div className={`bg-background/80 backdrop-blur-sm border-r border-border/50 h-full flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-border/50">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700" onClick={onNewChat}>
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className={`group relative rounded-md p-2 mb-1 cursor-pointer transition-colors border ${
                session.id === activeSessionId
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              } ${isCollapsed ? "flex justify-center" : ""}`}
              onClick={() => onSelectChat(session.id)}
            >
              {renamingId === session.id && !isCollapsed ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none"
                    autoFocus
                    onBlur={() => saveRename(session.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveRename(session.id)
                      if (e.key === "Escape") setRenamingId(null)
                    }}
                  />
                </div>
              ) : (
                <div className={`flex items-center justify-between w-full ${
                  isCollapsed ? "justify-center" : ""
                }`}>
                  {isCollapsed ? (
                    <span className="text-sm truncate" title={session.name}>
                      {session.name.charAt(0)}
                    </span>
                  ) : (
                    <>
                      <span className="truncate text-sm">{session.name}</span>
                      <div className={`flex opacity-0 group-hover:opacity-100 transition ${
                        isCollapsed ? "hidden" : ""
                      }`}>
                        <button
                          className="p-1 hover:bg-muted-foreground/10 rounded"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRename(session.id, session.name)
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="p-1 hover:bg-muted-foreground/10 rounded"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteChat(session.id)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}