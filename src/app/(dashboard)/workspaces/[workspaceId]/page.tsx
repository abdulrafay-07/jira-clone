import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

export default async function WorkspaceId() {
   const user = await getCurrent();

   if (!user) redirect("/sign-in");

   return (
      <div>
         Workspace id
      </div>
   )
};