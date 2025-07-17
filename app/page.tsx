'use client'

import { useTheme } from 'next-themes'
import {  useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { Sparkles, Code, MessageSquare, Cpu, LayoutDashboard, GitBranch, Smartphone } from 'lucide-react'

import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingTechStack } from '@/components/landing/LandingTechStack'
import { LandingCta } from '@/components/landing/LandingCta'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const controls = useAnimation()

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ opacity: 1, y: 0 }, { duration: 0.6 })
      await controls.start({ 
        scale: [1, 1.05, 1],
        transition: { repeat: Infinity, repeatType: "reverse", duration: 4 }
      })
    }
    sequence()
  }, [controls])

  const techStack = [
    { name: "Next.js 14+", icon: <GitBranch className="h-5 w-5" /> },
    { name: "Google Gemini", icon: <Cpu className="h-5 w-5" /> },
    { name: "Shadcn UI", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Framer Motion", icon: <Sparkles className="h-5 w-5" /> },
    { name: "Tailwind CSS", icon: <Code className="h-5 w-5" /> },
    { name: "Fully Responsive", icon: <Smartphone className="h-5 w-5" /> }
  ]

  const features = [
    {
      title: "Real-time Streaming",
      description: "See AI responses as they're generated with SSE technology",
      icon: <Sparkles className="h-6 w-6" />
    },
    {
      title: "Code Editing",
      description: "Dedicated editor for code blocks with syntax highlighting",
      icon: <Code className="h-6 w-6" />
    },
    {
      title: "Multi-session Chat",
      description: "Create, rename, and manage unlimited chat sessions",
      icon: <MessageSquare className="h-6 w-6" />
    }
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(93,95,239,0.1),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 [transform:rotateX(35deg)]">
          <div className="animate-grid [background-image:linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_0)] dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_0)] [background-repeat:repeat] [background-size:40px_40px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:200vw]" />
        </div>
      </div>

      <LandingHeader theme={theme} setTheme={setTheme} />
      <LandingHero controls={controls} />
      <LandingFeatures features={features} />
      <LandingTechStack techStack={techStack} />
      <LandingCta controls={controls} />
      <LandingFooter />
    </div>
  )
}