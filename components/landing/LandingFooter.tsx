export function LandingFooter() {
  return (
    <footer className="relative z-10 py-10 border-t">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Gemini AI Chatbot. All rights reserved.</p>
      </div>
    </footer>
  )
}