import { DottedSeparator } from "@/components/dotted-separator";
import {
   Tabs,
   TabsContent,
   TabsTrigger,
   TabsList,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const TaskViewSwitcher = () => {
   return (
      <Tabs
         defaultValue="table"
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
               >
                  <PlusIcon className="size-4" />
                  New
               </Button>
            </div>
            <DottedSeparator className="my-4" />
            Data filters
            <DottedSeparator className="my-4" />
            <>
               <TabsContent value="table" className="mt-0">
                  Data table
               </TabsContent>
               <TabsContent value="kanban" className="mt-0">
                  Data kanban
               </TabsContent>
               <TabsContent value="calendar" className="mt-0">
                  Data calendar
               </TabsContent>
            </>
         </div>
      </Tabs>
   )
};