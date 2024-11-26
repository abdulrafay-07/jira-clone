"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";
import { useInviteCode } from "@/features/workspaces/hooks/use-invite-code";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { DottedSeparator } from "@/components/dotted-separator";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JoinWorkspaceFormProps {
   initialValues: {
      name: string;
   };
};

export const JoinWorkspaceForm = ({
   initialValues,
}: JoinWorkspaceFormProps) => {
   const { mutate, isPending } = useJoinWorkspace();
   const workspaceId = useWorkspaceId();
   const inviteCode = useInviteCode();

   const router = useRouter();

   const onSubmit = () => {
      mutate({
         param: { workspaceId },
         json: { code: inviteCode },
      }, {
         onSuccess: ({ data }) => {
            router.push(`/workspaces/${data.$id}`);
         },
      });
   };

   return (
      <Card className="w-full h-full border-none shadow-none">
         <CardHeader className="p-7">
            <CardTitle className="text-xl font-bold">
               Join Workspace
            </CardTitle>
            <CardDescription>
               You've been invited to join <strong>{initialValues.name}</strong> workspace
            </CardDescription>
         </CardHeader>
         <div className="px-7">
            <DottedSeparator />
         </div>
         <CardContent className="p-7">
            <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
               <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  type="button"
                  className="w-full lg:w-fit"
                  disabled={isPending}
               >
                  <Link href="/">
                     Cancel
                  </Link>
               </Button>
               <Button
                  onClick={onSubmit}
                  size="lg"
                  type="button"
                  className="w-full lg:w-fit"
                  disabled={isPending}
               >
                  Join Workspace
               </Button>
            </div>
         </CardContent>
      </Card>
   )
};