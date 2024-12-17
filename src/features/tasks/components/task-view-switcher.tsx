"use client"

import { useCallback } from "react";

import { useQueryState } from "nuqs";

import { TaskStatus } from "@/features/tasks/types";
import { columns } from "@/features/tasks/components/columns";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { DataTable } from "@/features/tasks/components/data-table";
import { DataKanban } from "@/features/tasks/components/data-kanban";
import { DataFilter } from "@/features/tasks/components/data-filters";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { DataCalendar } from "@/features/tasks/components/data-calendar";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";

import { DottedSeparator } from "@/components/dotted-separator";
import {
   Tabs,
   TabsContent,
   TabsTrigger,
   TabsList,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, PlusIcon } from "lucide-react";

interface TaskViewSwitcherProps {
   hideProjectFilter?: boolean;
};

export const TaskViewSwitcher = ({
   hideProjectFilter,
}: TaskViewSwitcherProps) => {
   const [view, setView] = useQueryState("task-view", {
      defaultValue: "table",
   });
   const [{
      projectId,
      assigneeId,
      status,
      dueDate,
      search,
   }] = useTaskFilters();
   const { mutate: bulkUpdate } = useBulkUpdateTasks();

   const workspaceId = useWorkspaceId();
   const paramProjectId = useProjectId();
   
   const { open } = useCreateTaskModal();
   const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
      workspaceId,
      projectId: paramProjectId || projectId,
      assigneeId,
      status,
      dueDate,
      search,
   });

   const onKanbanChange = useCallback((tasks: { $id: string; status: TaskStatus, position: number }[]) => {
      bulkUpdate({
         json: {
            tasks,
         },
      });
   }, []);

   return (
      <Tabs
         defaultValue={view}
         onValueChange={setView}
         className="flex-1 w-full border rounded-lg"
      >
         <div className="h-full flex flex-col overflow-auto p-4">
            <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
               <TabsList className="w-full lg:w-auto">
                  <TabsTrigger
                     value="table"
                     className="h-8 w-full lg:w-auto"
                  >
                     Table
                  </TabsTrigger>
                  <TabsTrigger
                     value="kanban"
                     className="h-8 w-full lg:w-auto"
                  >
                     Kanban
                  </TabsTrigger>
                  <TabsTrigger
                     value="calendar"
                     className="h-8 w-full lg:w-auto"
                  >
                     Calendar
                  </TabsTrigger>
               </TabsList>
               <Button
                  size="sm"
                  className="w-full lg:w-auto"
                  onClick={() => open()}
               >
                  <PlusIcon className="size-4" />
                  New
               </Button>
            </div>
            <DottedSeparator className="my-4" />
            
            <DataFilter hideProjectFilter={hideProjectFilter} />

            <DottedSeparator className="my-4" />
            {isLoadingTasks ? (
               <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
                  <Loader className="size-5 animate-spin text-muted-foreground" />
               </div>
            ) : (
               <>
                  <TabsContent value="table" className="mt-0">
                     <DataTable columns={columns} data={tasks?.documents ?? []} />
                  </TabsContent>
                  <TabsContent value="kanban" className="mt-0">
                     <DataKanban data={tasks?.documents ?? []} onChange={onKanbanChange} />
                  </TabsContent>
                  <TabsContent value="calendar" className="mt-0">
                     <DataCalendar data={tasks?.documents ?? []} />
                  </TabsContent>
               </>
            )}
         </div>
      </Tabs>
   )
};