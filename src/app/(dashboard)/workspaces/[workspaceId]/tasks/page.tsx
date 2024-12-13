import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

export default async function Tasks() {
   const user = await getCurrent();
   if (!user) redirect("/sign-in");

   return (
      <div className="h-full flex flex-col">
         <TaskViewSwitcher />
      </div>
   )
};