import readUserSession from "../../lib2/actions";
import supabase from "@/utils/supabase";

export async function UpdateUserSubscription(body) {
  if (body.data.attributes.status == "active") {
    const email = body.data.attributes.user_email;
    console.log(
      "User is not signed in through Supabase, here's the user email from Lemon Squeezy:",
      email
    );

    try {
      // Check if email already exists
      const { data: existingUserPackage, error: fetchError } = await supabase
        .from("user_packages")
        .select("*")
        .eq("email", email);

      if (fetchError) {
        console.error("Error fetching existing user package:", fetchError);
        return null;
      } else {
        console.log("fetched user package");
      }

      if (existingUserPackage && existingUserPackage.length > 0) {
        // Email exists, update the package type
        const { data: updateData, error: updateError } = await supabase
          .from("user_packages")
          .update({ package_type: 1 })
          .eq("email", email);

        if (updateError) {
          console.error("Error updating user package:", updateError);
          return null;
        }

        console.log("Successfully updated user package");
      } else {
        // Email doesn't exist, insert new record
        const { data: insertData, error: insertError } = await supabase
          .from("user_packages")
          .insert([{ email: email, package_type: 1 }]);

        if (insertError) {
          console.error("Error inserting new user package:", insertError);
          return null;
        }

        console.log("Successfully inserted new user package");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
