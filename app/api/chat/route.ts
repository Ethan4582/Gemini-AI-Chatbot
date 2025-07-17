import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Get the generative model - use the current available model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Convert messages to Gemini format
    const chat = model.startChat({
      history: messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    })

    // Get the latest user message
    const latestMessage = messages[messages.length - 1]

    // Create a readable stream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await chat.sendMessageStream(latestMessage.content)

          for await (const chunk of result.stream) {
            const chunkText = chunk.text()
            if (chunkText) {
              // Send each chunk as Server-Sent Events format
              controller.enqueue(new TextEncoder().encode(`data: ${chunkText}\n\n`))
            }
          }

          // Send completion signal
          controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`))
          controller.close()
        } catch (streamError) {
          console.error("Streaming error:", streamError)

          // Send error message to client
          const errorMessage = streamError instanceof Error ? streamError.message : "Unknown streaming error"
          controller.enqueue(new TextEncoder().encode(`data: Error: ${errorMessage}\n\n`))
          controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("API Error:", error)

    // Return more specific error messages
    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: "Model not available" }, { status: 404 })
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
