# Gemini AI Chatbot

A modern, responsive chatbot interface powered by Google's Gemini AI, built with Next.js 14+ and featuring real-time streaming responses.

## ✨ Key Features

- **🤖 Gemini AI Integration** - Powered by Google's latest Gemini 1.5 Flash model
- **⚡ Real-time Streaming** - Instant message delivery as responses are generated
- **🎨 Modern UI** - Beautiful interface built with Shadcn UI components
- **🌓 Dark/Light Mode** - Seamless theme switching
- **📱 Fully Responsive** - Optimized for all device sizes
- **📋 Multi-session Chat** - Create and manage multiple chat conversations
- **✏️ Message Editing** - Edit your previous messages
- **📝 Code Editing** - Specialized editor for code blocks with syntax highlighting
- **📋 Copy Functionality** - One-click copy for messages and code
- **🗑️ Session Management** - Create, rename, and delete chat sessions
- **🚀 Performance Optimized** - Built with Next.js App Router for blazing fast speeds

## 🛠 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **AI Provider**: [Google Gemini AI](https://ai.google.dev/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API key
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/gemini-chatbot.git
   cd gemini-chatbot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

4. **Add your Gemini API key to `.env.local`**:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser**.

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

**Note**: This app uses the `gemini-1.5-flash` model. If you encounter model availability issues, you can also try `gemini-1.5-pro` by updating the model name in `app/api/chat/route.ts`.

## Project Structure

```bash
├── app/
│   ├── api/chat/route.ts      # API route for Gemini integration
│   ├── layout.tsx             # Root layout with theme provider
│   ├── page.tsx               # Main chat interface
│   └── globals.css            # Global styles
├── components/
|── |── chat                   # Chat UI components
│   ├── ui/                    # Shadcn UI components
│   └── theme-provider.tsx     # Theme provider component
├── lib/
│   └── utils.ts               # Utility functions
└── README.md
```

## API Routes

### POST /api/chat

Handles chat messages and returns streaming responses from Gemini AI.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user" | "assistant",
      "content": "string"
    }
  ]
}
```

**Response:**
Streaming text response in Server-Sent Events format.


## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

If you encounter any issues, please create an issue in the GitHub repository.
