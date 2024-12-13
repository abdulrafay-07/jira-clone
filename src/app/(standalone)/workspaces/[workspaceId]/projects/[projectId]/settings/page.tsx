import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { ProjectIdSettingsClient } from "@/app/(standalone)/workspaces/[workspaceId]/projects/[projectId]/settings/client";

export default async function ProjectIdSettings() {
   const user = await getCurrent();
   if (!user) redirect("/sign-in");

   return <ProjectIdSettingsClient />
};