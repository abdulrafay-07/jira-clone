import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";

interface ProjectIdSettingsProps {
   params: {
      projectId: string;
   };
};

export default async function ProjectIdSettings({
   params,
}: ProjectIdSettingsProps) {
   const user = await getCurrent();

   if (!user) redirect("/sign-in");

   const initialValues = await getProject({ projectId: params.projectId });

   return (
      <div className="w-full lg:max-w-xl">
         <EditProjectForm initialValues={initialValues} />
      </div>
   )
};