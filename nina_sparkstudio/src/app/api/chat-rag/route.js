import axios from "axios";

// POST request handler
export async function POST(req) {
  const { history } = await req.json();

  try {
    const requestBody = {
      chat_history: history.map((entry) => ({
        role: entry.role || "user", // Default to "user" if role is not provided
        content: entry.content,
      })),
    };

    console.log(requestBody);

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

    if(response) {
        console.log(response)
    }

    return response;

    // return new Response(JSON.stringify(response), {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
  } catch (error) {
    console.error("Error chatting with rag.", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
