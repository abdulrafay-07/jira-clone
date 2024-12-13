import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { WorkspaceIdSettingsClient } from "@/app/(standalone)/workspaces/[workspaceId]/settings/client";

export default async function WorkspaceIdSettings() {
   const user = await getCurrent();
   if (!user) redirect("/sign-in");

   return <WorkspaceIdSettingsClient />
};