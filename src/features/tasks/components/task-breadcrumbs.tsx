import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDeleteTask } from "@/features/tasks/api/use-delete-task";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useConfirm } from "@/hooks/use-confirm";
import { Project } from "@/features/projects/types";
import { Task } from "@/features/tasks/types";

import { Button } from "@/components/ui/button";
import { ChevronRight, TrashIcon } from "lucide-react";

interface TaskBreadcrumbsProps {
   project: Project;
   task: Task;
};

export const TaskBreadcrumbs = ({
   project,
   task,
}: TaskBreadcrumbsProps) => {
   const { mutate, isPending } = useDeleteTask();
   const workspaceId = useWorkspaceId();
   const [ConfirmDialog, confirm] = useConfirm(
      "Delete Task?",
      "This action cannot be undone.",
      "destructive",
   );

   const router = useRouter();

   const handleDeleteTask = async () => {
      const ok = await confirm();
      if (!ok) return;

      mutate({
         param: {
            taskId: task.$id,
         },
      }, {
         onSuccess: () => {
            router.push(`/workspaces/${workspaceId}/tasks`);
         },
      });
   };

   return (
      <div className="flex items-center gap-x-2">
         <ConfirmDialog />
         <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-6 lg:size-8"
         />
         <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
            <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
               {project.name}
            </p>
         </Link>
         <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
         <p className="text-sm lg:text-lg font-semibold">
            {task.name}
         </p>
         <Button
            onClick={handleDeleteTask}
            disabled={isPending}
            className="ml-auto"
            variant="destructive"
            size="sm"
         >
            <TrashIcon className="size-4" />
            <span className="hidden lg:block">Delete Task</span>
         </Button>
      </div>
   )
};