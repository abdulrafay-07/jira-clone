import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.signup["$post"]>;
type RequestType = InferRequestType<typeof client.api.auth.signup["$post"]>;

export const useSignup = () => {
   const router = useRouter();
   const queryClient = useQueryClient();

   const mutation = useMutation<
      ResponseType,
      Error,
      RequestType
   >({
      mutationFn: async ({ json }) => {
         const response = await client.api.auth.signup["$post"]({ json });

         if (!response.ok) throw new Error();

         return await response.json()
      },
      onSuccess: () => {
         toast.success("User signed up successfully");
         router.refresh();

         // when the user log out, we refetch the current user using the queryKey
         queryClient.invalidateQueries({ queryKey: ["current"] });
      },
      onError: () => {
         toast.error("Failed to register");
      },
   });

   return mutation;
};