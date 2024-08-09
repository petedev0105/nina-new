// pages/api/user-information.js

import createSupabaseServerClient from "../../../lib/supabase/server";
import axios from "axios";

export async function POST(req, res) {
  const { userId } = await req.json();
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("user_information")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return new Response(JSON.stringify({ message: "no-rows" }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        return new Response(JSON.stringify({ error: "500 error" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
