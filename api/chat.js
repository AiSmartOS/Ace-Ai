export function GET() {
    return new Response(
        JSON.stringify({
            status: "ok",
            message: "Ace-Ai backend is running!"
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
        const body = await request.json();

        const message = body.message;

        if (!message) {
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

        return new Response(
            JSON.stringify({
                success: true,
                reply: `Ace-Ai backend received: ${message}`
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "Invalid JSON request"
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}
