import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { MembersList } from "@/features/members/components/members-list";

export default async function WorkspaceIdMembers() {
   const user = await getCurrent();

   if (!user) redirect("/sign-in");

   return (
      <div className="w-full lg:max-w-xl">
         <MembersList />
      </div>
   )
};