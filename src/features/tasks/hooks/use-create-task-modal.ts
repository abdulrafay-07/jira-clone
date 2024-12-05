import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";

import { TaskStatus } from "@/features/tasks/types";

export const useCreateTaskModal = () => {
   const [isOpen, setIsOpen] = useQueryState(
      "create-task",
      parseAsBoolean.withDefault(false).withOptions({
         clearOnDefault: true,
      }),
   );

   const [defaultStatus, setDefaultStatus] = useQueryState<string>(
      "default-status",
      parseAsString.withDefault("").withOptions({
         clearOnDefault: true,
      }),
   );

   const open = (status?: TaskStatus) => {
      setIsOpen(true);

      if (status && Object.values(TaskStatus).includes(status)) {
         setDefaultStatus(status);
      };
   };
   const close = () => {
      setIsOpen(false);
      setDefaultStatus(null);
   };

   return {
      isOpen,
      open,
      close,
      setIsOpen,
      defaultStatus,
      setDefaultStatus,
   };
};