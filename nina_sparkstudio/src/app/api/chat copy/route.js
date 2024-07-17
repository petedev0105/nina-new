import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: "sk-proj-bgfTTn27Q2MV5QRGvxgWT3BlbkFJ6585yi4aLjcS6mPBLfzJ",
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req) {
  // Extract the `prompt` from the body of the request
  const { prompt, history } = await req.json();

  const systemPrompt = {
    role: "system",
    content:
      "You are an expert health coach called NINA AI. Your primary goal is to provide accurate, clear, and concise information to help users understand and learn. Maintain a friendly and supportive tone, and strive to be as helpful and informative as possible. Ensure your explanations are easy to understand, and provide examples where applicable. Give responses in Markdown format.",
  };

  const formattedHistory = history.map((message) => {
    return {
      role: message.sender,
      content: message.content,
    };
  });

  function convertBotToSystem(messages) {
    return messages.map((message) => {
      if (message.role === "bot") {
        return { ...message, role: "assistant" };
      }
      return message;
    });
  }

  const updatedHistory = convertBotToSystem(formattedHistory);

  const conversationHistory = [
    systemPrompt,
    ...updatedHistory,
    { role: "user", content: prompt },
  ];

  console.log(conversationHistory);

  try {
    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: conversationHistory,
      frequency_penalty: 0,
      presence_penalty: 0,
      temperature: 0.7,
      top_p: 1,
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching all document sources:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
