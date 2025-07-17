import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function LandingHero({ controls }: { controls: any }) {
  return (
    <section className="relative z-10 min-h-screen flex items-center pt-16">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-border mb-6"
          >
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Powered by Gemini 1.5 Flash</span>
            <ArrowRight className="ml-2 h-4 w-4 duration-300 group-hover:translate-x-1" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold tracking-tight leading-tight"
          >
            The Next Generation <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Chat Experience
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl"
          >
            A modern, responsive chatbot interface built with Next.js and powered by Google's Gemini AI, featuring real-time streaming responses.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link href="/chat">
              <Button size="lg" className="group px-8 py-6 text-base">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-6 text-base">
              View on GitHub
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}