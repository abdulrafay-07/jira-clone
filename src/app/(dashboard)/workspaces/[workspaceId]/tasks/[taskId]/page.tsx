import { redirect } from "next/navigation";

import { TaskIdClient } from "@/app/(dashboard)/workspaces/[workspaceId]/tasks/[taskId]//client";
import { getCurrent } from "@/features/auth/queries";

export default async function TaskId() {
   const user = await getCurrent();
   if (!user) redirect("/sign-in");

   return <TaskIdClient />;
};