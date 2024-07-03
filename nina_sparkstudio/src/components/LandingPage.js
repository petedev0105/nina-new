import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="py-5 flex justify-center items-center">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 rounded-full bg-green-500"></div>{" "}
          <span className="text-xl font-medium">Nina</span>
        </div>
      </div>
      <div className="flex justify-center pt-24">
        <span className="text-5xl font-medium">
          Your personal health companion.
        </span>
      </div>
      <div>
        <div className="flex justify-center pt-10">
          <Link href="/dashboard">
            {" "}
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
