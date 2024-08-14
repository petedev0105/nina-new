import axios from "axios";

// POST request handler
export async function POST(req) {
  const { history } = await req.json();

  try {
    const requestBody = {
      user_info: {
        basic_info: {
          name: "Ethan Trang",
          age: 18,
          gender: "Male",
          height: 170,
          weight: 64,
        },
        health_fitness: {
          activity_level: "moderately active (3-5 days)",
          goals: "Muscle gain, edurance",
          activity_types: "Strength Training",
          medical_conditions: "None",
          allergies: "None",
          dietary_preferences: "Vegan",
        },
        lifestyle: {
          sleep: "8+ hours",
          stress_level: 5,
        },
        fitness_nutrition_data: {
          workout_history: "3 days a week strength training",
          dietary_intake: "3 meals a day",
          water_intake: "2-3 liters/day (standard)",
          supplement_use: "None",
        },
        advanced_data: {
          heart_rate: "",
          daily_steps: "",
        },
        privacy_consent: {
          data_collection_consent: true,
          data_sharing_preferences: true,
        },
      },
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

    if (response) {
      console.log(response.data.content);
    }

    // return response;
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

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
