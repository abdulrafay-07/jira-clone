"use client"

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error() {
   return (
      <div className="h-screen flex flex-col gap-y-3 items-center justify-center">
         <AlertTriangle className="size-6" />
         <p className="text-sm">
            Something went wrong
         </p>
         <Button asChild size="sm" variant="secondary">
            <Link href="/">
               Back to home
            </Link>
         </Button>
      </div>
   )
};