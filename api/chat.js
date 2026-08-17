export async function GET() {
    return new Response(
        JSON.stringify({
            status: "ok",
            message: "Ace-Ai AI backend is running!"
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}

export async function POST(request) {
    try {
        const { message } = await request.json();

        if (!message || !message.trim()) {
            return new Response(
                JSON.stringify({
                    error: "Message is required"
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return new Response(
                JSON.stringify({
                    error: "OpenRouter API key is not configured."
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const aiResponse = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://aismartos.github.io/Ace-Ai/",
                    "X-Title": "Ace-Ai"
                },
                body: JSON.stringify({
                    model: "openrouter/free",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are Ace-Ai, an intelligent assistant powered by AiSmartOS. Give helpful, clear and accurate answers. If you are unsure about something, say so instead of making it up."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await aiResponse.json();

        if (!aiResponse.ok) {
            return new Response(
                JSON.stringify({
                    error:
                        data?.error?.message ||
                        "OpenRouter request failed."
                }),
                {
                    status: aiResponse.status,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const reply =
            data?.choices?.[0]?.message?.content ||
            "Sorry, I couldn't generate a response.";

        return new Response(
            JSON.stringify({
                success: true,
                reply: reply
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (error) {
        console.error("Ace-Ai error:", error);

        return new Response(
            JSON.stringify({
                error: "Unable to connect to the AI."
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
            }
