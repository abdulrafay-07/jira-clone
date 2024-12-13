import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { ProjectIdClient } from "@/app/(dashboard)/workspaces/[workspaceId]/projects/[projectId]/client";

export default async function ProjectId() {
   const user = await getCurrent();

   if (!user) redirect("/sign-in");

   return <ProjectIdClient />
};