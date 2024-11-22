import { useRouter } from "next/navigation";

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

         return await response.json()
      },
      onSuccess: () => {
         router.refresh();

         // when the user log out, we refetch the current user using the queryKey
         queryClient.invalidateQueries({ queryKey: ["current"] });
      },
   });

   return mutation;
};