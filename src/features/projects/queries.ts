import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { Project } from "@/features/projects/types";
import { createSessionClient } from "@/lib/appwrite";

export const getProject = async ({ projectId }: { projectId: string }) => {
   const { account, databases } = await createSessionClient();

   const user = await account.get();

   const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
   );

   const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId,
   });

   if (!member) throw new Error("Unauthorized");

   return project;
};