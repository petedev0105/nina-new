"use server";

// Import necessary modules
import createSupabaseServerClient from "@/lib/supabase/server";
// import { useRouter } from "next/navigation";

// Define handleSignOut function
const handleSignOut = async () => {
  // const router = useRouter()
  // Perform sign out action
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (!error) {
    //   window.location.assign(window.location.href);
    return true;
    }
  } catch (error) {
    console.log(error);
  }
};

// Export handleSignOut function
export default handleSignOut;
