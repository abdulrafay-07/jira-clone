import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.logout["$post"]>;

export const useLogout = () => {
   const router = useRouter();
   const queryClient = useQueryClient();

   const mutation = useMutation<
      ResponseType,
      Error
   >({
      mutationFn: async () => {
         const response = await client.api.auth.logout["$post"]();

         if (!response.ok) throw new Error();

         return await response.json();
      },
      onSuccess: () => {
         toast.success("Logged out successfully");
         router.refresh();

         // when the user log out, we refetch the current user using the queryKey
         queryClient.invalidateQueries({ queryKey: ["current"] });
      },
      onError: () => {
         toast.error("Failed to log out");
      },
   });

   return mutation;
};