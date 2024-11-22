"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import {
   Sheet,
   SheetContent,
   SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const MobileSidebar = () => {
   const [isOpen, setIsOpen] = useState(false);

   const pathname = usePathname();

   useEffect(() => {
      setIsOpen(false);
   }, [pathname]);

   return (
      <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
         <SheetTrigger asChild>
            <Button size="icon" variant="secondary" className="lg:hidden">
               <Menu className="size-4 text-neutral-500" />
            </Button>
         </SheetTrigger>
         <SheetContent side="left" className="p-0">
            <Sidebar />
         </SheetContent>
      </Sheet>
   )
};