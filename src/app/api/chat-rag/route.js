import axios from "axios";

export async function POST(req) {
  const requestBody = await req.json();

  console.log('logging from chat-rag endpoint...')

  try {
    const response = await axios.post(
      "https://nina-render.onrender.com/chat/",
      requestBody,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in chat-rag API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}