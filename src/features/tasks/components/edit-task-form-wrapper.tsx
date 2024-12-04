import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-project";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { EditTaskForm } from "@/features/tasks/components/edit-task-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import {
   Card,
   CardContent,
} from "@/components/ui/card";
import { Loader } from "lucide-react";

interface EditTaskFormWrapperProps {
   onCancel: () => void;
   id: string;
};

export const EditTaskFormWrapper = ({
   onCancel,
   id,
}: EditTaskFormWrapperProps) => {
   const workspaceId = useWorkspaceId();
   const { data: initialValues, isLoading: isLoadingTask } = useGetTask({ taskId: id });
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

   const isLoading = isLoadingMembers || isLoadingProjects || isLoadingTask;

   if (isLoading) {
      return (
         <Card className="w-full h-[714px] border-none shadow-none">
            <CardContent className="flex items-center justify-center h-full">
               <Loader className="size-5 animate-spin text-muted-foreground" />
            </CardContent>
         </Card>
      )
   };

   if (!initialValues) return null;

   return (
      <EditTaskForm
         onCancel={onCancel}
         initialValues={initialValues}
         projectOptions={projectOptions ?? []}
         memberOptions={memberOptions ?? []}
      />
   )
};