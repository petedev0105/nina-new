import createSupabaseServerClient from "../../../lib/supabase/server";

export async function POST(req, res) {
  const { userId, formData } = await req.json();
  console.log(userId, formData);

  try {
    const supabase = await createSupabaseServerClient();

    // Restructure the formData to match the new schema
    const structuredData = {
      basic_info: {
        name: formData.name,
        age: formData.age ? parseInt(formData.age, 10) : null,
        gender: formData.gender,
        height: formData.height ? parseInt(formData.height, 10) : null,
        weight: formData.weight ? parseInt(formData.weight, 10) : null
      },
      health_fitness: {
        activity_level: formData.activity_level,
        goals: formData.goals,
        activity_types: formData.activity_type,
        medical_conditions: formData.medical_conditions,
        allergies: formData.allergies,
        dietary_preferences: formData.dietary_preferences
      },
      lifestyle: {
        sleep: formData.sleep,
        stress_level: formData.stress_level ? parseInt(formData.stress_level, 10) : null
      },
      fitness_nutrition_data: {
        workout_history: formData.workout_history,
        dietary_intake: formData.dietary_intake,
        water_intake: formData.water_intake,
        supplement_use: formData.supplements
      },
      advanced_data: {
        heart_rate: formData.heart_rate,
        daily_steps: formData.daily_steps ? parseInt(formData.daily_steps, 10) : null
      },
      privacy_consent: {
        data_collection_consent: formData.consent,
        data_sharing_preferences: formData.data_sharing
      }
    };

    // Check if the user information exists
    const { data: existingData, error: fetchError } = await supabase
      .from("user_information")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    let result;
    if (!existingData) {
      // If user information does not exist, insert a new row
      const { data, error } = await supabase
        .from("user_information")
        .insert({ user_id: userId, ...structuredData });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      result = data;
    } else {
      // If user information exists, update the row
      const { data, error } = await supabase
        .from("user_information")
        .update(structuredData)
        .eq("user_id", userId);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      result = data;
    }

    return new Response(
      JSON.stringify({ message: "User info saved successfully.", result }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}