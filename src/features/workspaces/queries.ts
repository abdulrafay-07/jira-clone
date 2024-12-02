"use server"

import { Query } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { Workspace } from "@/features/workspaces/types";
import { createSessionClient } from "@/lib/appwrite";

export const getWorkspaces = async () => {
   const { account, databases } = await createSessionClient();

   const user = await account.get();

   const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [
         Query.equal("userId", user.$id),
      ],
   );

   if (members.total === 0) {
      return { documents: [], total: 0 };
   };

   const workspaceIds = members.documents.map((member) => member.workspaceId);

   const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID,
      [
         Query.orderAsc("$createdAt"),
         Query.contains("$id", workspaceIds),
      ],
   );

   return workspaces;
};

export const getWorkspace = async ({ workspaceId }: { workspaceId: string }) => {
   const { account, databases } = await createSessionClient();

   const user = await account.get();

   const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
   });

   if (!member) throw new Error("Unauthorized");

   const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId
   );

   return workspace;
};

export const getWorkspaceInfo = async ({ workspaceId }: { workspaceId: string }) => {
   const { databases } = await createSessionClient();

   const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId
   );

   return {
      name: workspace.name,
   };
};