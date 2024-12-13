import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { WorkspaceIdJoinClient } from "@/app/(standalone)/workspaces/[workspaceId]/join/[inviteCode]/client";

export default async function WorkspaceIdJoin() {
   const user = await getCurrent();
   if (!user) redirect("/sign-in");

   return <WorkspaceIdJoinClient />
};