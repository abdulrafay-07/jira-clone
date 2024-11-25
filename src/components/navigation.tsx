"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";
import { Settings, Users } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { cn } from "@/lib/utils";

const routes = [
   {
      label: "Home",
      href: "",
      icon: GoHome,
      activeIcon: GoHomeFill,
   },
   {
      label: "My Tasks",
      href: "/tasks",
      icon: GoCheckCircle,
      activeIcon: GoCheckCircleFill,
   },
   {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      activeIcon: Settings,
   },
   {
      label: "Members",
      href: "/members",
      icon: Users,
      activeIcon: Users,
   },
];

export const Navigation = () => {
   const workspaceId = useWorkspaceId();
   const pathname = usePathname();

   return (
      <ul className="flex flex-col">
         {routes.map((route) => {
            const fullHref = `/workspaces/${workspaceId}${route.href}`
            const isActive = pathname === fullHref;
            const Icon = isActive ? route.activeIcon : route.icon;

            return (
               <Link
                  key={route.href}
                  href={fullHref}
               >
                  <div className={cn(
                     "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                     isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                  )}>
                     <Icon className="size-5 text-neutral-500" />
                     {route.label}
                  </div>
               </Link>
            )
         })}
      </ul>
   )
};