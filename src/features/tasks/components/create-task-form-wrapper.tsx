import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-project";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { CreateTaskForm } from "@/features/tasks/components/create-task-form";
import { TaskStatus } from "@/features/tasks/types";

import {
   Card,
   CardContent,
} from "@/components/ui/card";
import { Loader } from "lucide-react";

interface CreateTaskFormWrapperProps {
   onCancel: () => void;
   status: TaskStatus | string;
};

export const CreateTaskFormWrapper = ({
   onCancel,
   status,
}: CreateTaskFormWrapperProps) => {
   const workspaceId = useWorkspaceId();
   const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
   const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

   const projectOptions = projects?.documents.map((project) => ({
      id: project.$id,
      name: project.name,
      imageUrl: project.imageUrl,
   }));

   const memberOptions = members?.documents.map((member) => ({
      id: member.$id,
      name: member.name,
   }));

   const isLoading = isLoadingMembers || isLoadingProjects;

   if (isLoading) {
      return (
         <Card className="w-full h-[714px] border-none shadow-none">
            <CardContent className="flex items-center justify-center h-full">
               <Loader className="size-5 animate-spin text-muted-foreground" />
            </CardContent>
         </Card>
      )
   };

   return (
      <CreateTaskForm
         onCancel={onCancel}
         projectOptions={projectOptions ?? []}
         memberOptions={memberOptions ?? []}
         status={status}
      />
   )
};