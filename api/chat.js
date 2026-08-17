export async function GET() {
    return Response.json({
        status: "ok",
        message: "Ace-Ai OpenAI backend is running!"
    });
}

export async function POST(request) {
    try {
        const { message } = await request.json();

        if (!message || !message.trim()) {
            return Response.json(
                { error: "Message is required." },
                { status: 400 }
            );
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return Response.json(
                { error: "OPENAI_API_KEY is not configured." },
                { status: 500 }
            );
        }

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-5.6",
                    input: message
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenAI error:", data);

            return Response.json(
                {
                    error:
                        data?.error?.message ||
                        "OpenAI request failed."
                },
                { status: response.status }
            );
        }

        return Response.json({
            success: true,
            reply: data.output_text || "No response generated."
        });

    } catch (error) {
        console.error("Ace-Ai backend error:", error);

        return Response.json(
            {
                error: "Unable to connect to Ace-Ai."
            },
            { status: 500 }
        );
    }
                      }
