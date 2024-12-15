import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { WorkspaceIdClient } from "@/app/(dashboard)/workspaces/[workspaceId]/client";

export default async function WorkspaceId() {
   const user = await getCurrent();

   if (!user) redirect("/sign-in");

   return <WorkspaceIdClient />;
};