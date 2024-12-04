import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.projects[":projectId"]["$patch"]>;

export const useUpdateProject = () => {
   const router = useRouter();

   const queryClient = useQueryClient();

   const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
   >({
      mutationFn: async ({ param, form }) => {
         const response = await client.api.projects[":projectId"]["$patch"]({ param, form });

         if (!response.ok) throw new Error();

         return await response.json();
      },
      onSuccess: ({ data }) => {
         toast.success("Project updated");
         router.refresh();

         queryClient.invalidateQueries({ queryKey: ["projects"] });
         queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
      },
      onError: () => {
         toast.error("Failed to update project");
      },
   });

   return mutation;
};