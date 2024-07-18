import readUserSession from "../../lib2/actions";
import React from "react";
import supabase from "@/utils/supabase";

export async function UpdateUserPackage(lemonSqueezyUserData) {
  const { userData } = await readUserSession();
  console.log("alemonSqueezyUserData");
  console.log(lemonSqueezyUserData);
  if (userData) {
    const email = userData.session.user.email;
    // Check if email already exists
    const { data: existingUserPackage, error: fetchError } = await supabase
      .from("user_packages")
      .select("*")
      .eq("email", email);

    if (fetchError) {
      console.error("Error fetching existing user package:", fetchError);
      return null;
    }

    if (existingUserPackage && existingUserPackage.length > 0) {
      // Update the existing row with the new package_type
      const { data: updateData, error: updateError } = await supabase
        .from("user_packages")
        .update({ package_type: 1 })
        .eq("email", email);

      if (updateError) {
        console.error("Error updating user package:", updateError);
        return null;
      }
    }
    console.log(userData);
    const { data, error } = await supabase.from("user_packages").upsert({
      email: email,
      package_type: 1,
    });
    console.log("lemon data");
    console.log(data);
    return data;
  } else {
    const email = lemonSqueezyUserData.data.attributes.user_email;
    // Check if email already exists
    const { data: existingUserPackage, error: fetchError } = await supabase
      .from("user_packages")
      .select("*")
      .eq("email", email);

    if (fetchError) {
      console.error("Error fetching existing user package:", fetchError);
      return null;
    }

    if (existingUserPackage && existingUserPackage.length > 0) {
      // Update the existing row with the new package_type
      const { data: updateData, error: updateError } = await supabase
        .from("user_packages")
        .update({ package_type: 1 })
        .eq("email", email);

      if (updateError) {
        console.error("Error updating user package:", updateError);
        return null;
      }

      return updateData;
    }
    const { data, error } = await supabase.from("user_packages").upsert({
      email: email,
      package_type: 1,
    });
    console.log("not lemon data");
    console.log(data);
    return data;
  }
}
