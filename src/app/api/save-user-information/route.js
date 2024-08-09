import createSupabaseServerClient from "../../../lib/supabase/server";

export async function POST(req, res) {
  const { userId, formData } = await req.json();
  console.log(userId, formData)

  try {
    const supabase = await createSupabaseServerClient();
     // Ensure integer fields are properly formatted
  const cleanFormData = {
    ...formData,
    age: formData.age ? parseInt(formData.age, 10) : null,
    height: formData.height ? parseInt(formData.height, 10) : null,
    weight: formData.weight ? parseInt(formData.weight, 10) : null,
    stress_level: formData.stress_level ? parseInt(formData.stress_level, 10) : null,
    daily_steps: formData.daily_steps ? parseInt(formData.daily_steps, 10) : null
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
        .insert({ user_id: userId, ...cleanFormData });

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
        .update(cleanFormData)
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
