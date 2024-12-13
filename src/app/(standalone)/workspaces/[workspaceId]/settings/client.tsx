"use client"

import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";

export const WorkspaceIdSettingsClient = () => {
   const workspaceId = useWorkspaceId();
   const { data, isLoading } = useGetWorkspace({ workspaceId });

   if (isLoading) return <PageLoader />;

   if (!data) return <PageError message="Workspace not found" />;

   return (
      <div className="w-full lg:max-w-xl">
         <EditWorkspaceForm initialValues={data} />
      </div>
   )
};