"use client"

import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DottedSeparator } from "@/components/dotted-separator";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Avatar,
   AvatarFallback,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ImageIcon } from "lucide-react";

import { updateWorkspaceSchema } from "@/features/workspaces/schema";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useDeleteWorkspace } from "@/features/workspaces/api/use-delete-workspace";
import { Workspace } from "@/features/workspaces/types";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";

interface EditWorkspaceFormProps {
   onCancel?: () => void;
   initialValues: Workspace;
};

export const EditWorkspaceForm = ({
   onCancel,
   initialValues,
}: EditWorkspaceFormProps) => {
   const { mutate, isPending } = useUpdateWorkspace();
   const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace();
   const [DeleteDialog, confirmDelete] = useConfirm(
      "Delete Workspace",
      "This action cannot be undone",
      "destructive",
   );

   const router = useRouter();

   const inputRef = useRef<HTMLInputElement>(null);

   const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
      resolver: zodResolver(updateWorkspaceSchema),
      defaultValues: {
         ...initialValues,
         image: initialValues.imageUrl ?? "",
      },
   });

   const onSubmit = (data: z.infer<typeof updateWorkspaceSchema>) => {
      const finalData = {
         ...data,
         image: data.image instanceof File ? data.image : "",
      };

      mutate({
         form: finalData,
         param: { workspaceId: initialValues.$id },
      }, {
         onSuccess: ({ data }) => {
            form.reset();

            router.push(`/workspaces/${data.$id}`);
         },
      });
   };

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
         form.setValue("image", file);
      };
   };

   const handleDelete = async () => {
      const ok = await confirmDelete();

      if (!ok) return;

      deleteWorkspace({
         param: {
            workspaceId: initialValues.$id,
         },
      }, {
         onSuccess: () => {
            router.push("/");
         },
      });
   };

   return (
      <div className="flex flex-col gap-y-4">
         <DeleteDialog />
         <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
               <Button
                  size="sm"
                  variant="secondary"
                  onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}
               >
                  <ArrowLeft className="size-4" /> Back
               </Button>
               <CardTitle className="text-xl font-bold">
                  {initialValues.name}
               </CardTitle>
            </CardHeader>
            <div className="px-7">
               <DottedSeparator />
            </div>
            <CardContent className="p-7">
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                     <div className="flex flex-col gap-y-4">
                        <FormField
                           control={form.control}
                           name="name"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Workspace Name</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Enter workspace name"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="image"
                           render={({ field }) => (
                              <div className="flex flex-col gap-y-2">
                                 <div className="flex items-center gap-x-2">
                                    {field.value ? (
                                       <div className="size-[72px] relative rounded-md overflow-hidden">
                                          <Image
                                             src={
                                                field.value instanceof File
                                                   ? URL.createObjectURL(field.value)
                                                   : field.value
                                             }
                                             alt="Preview image logo"
                                             fill
                                             className="object-cover"
                                          />
                                       </div>
                                    ) : (
                                       <Avatar className="size-[72px]">
                                          <AvatarFallback>
                                             <ImageIcon className="size-[36px] text-neutral-400" />
                                          </AvatarFallback>
                                       </Avatar>
                                    )}
                                    <div className="flex flex-col">
                                       <p className="text-sm">Workspace Icon</p>
                                       <p className="text-sm text-muted-foreground">
                                          JPG, PNG, SVG, or JPEG, max 1mb
                                       </p>
                                       <input
                                          accept=".jpg, .png, .jpeg, .svg"
                                          type="file"
                                          ref={inputRef}
                                          onChange={handleImageChange}
                                          disabled={isPending}
                                          className="hidden"
                                       />
                                       {field.value ? (
                                          <Button
                                             type="button"
                                             disabled={isPending}
                                             variant="destructive"
                                             size="xs"
                                             className="w-fit mt-2"
                                             onClick={() => {
                                                field.onChange(null);
                                                if (inputRef.current) {
                                                   inputRef.current.value = "";
                                                };
                                             }}
                                          >
                                             Remove Image
                                          </Button>
                                       ) : (
                                          <Button
                                             type="button"
                                             disabled={isPending}
                                             variant="teritary"
                                             size="xs"
                                             className="w-fit mt-2"
                                             onClick={() => inputRef.current?.click()}
                                          >
                                             Upload Image
                                          </Button>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           )}
                        />
                     </div>
                     <DottedSeparator className="py-7" />
                     <div className="flex items-center justify-between">
                        <Button
                           type="button"
                           size="lg"
                           variant="secondary"
                           onClick={onCancel}
                           disabled={isPending}
                           className={cn(!onCancel && "invisible")}
                        >
                           Cancel
                        </Button>
                        <Button
                           type="submit"
                           size="lg"
                           disabled={isPending}
                        >
                           Save Changes
                        </Button>
                     </div>
                  </form>
               </Form>
            </CardContent>
         </Card>
         <Card className="w-full h-full border-none shadow-none">
            <CardContent className="p-7">
               <div className="flex flex-col">
                  <h3 className="font-bold">
                     Danger Zone
                  </h3>
                  <p className="text-sm text-muted-foreground">
                     Deleting a workspace is irreversible and will remove all associated data.
                  </p>
                  <Button
                     size="sm"
                     variant="destructive"
                     className="mt-6 w-fit ml-auto"
                     type="button"
                     disabled={isDeletingWorkspace}
                     onClick={handleDelete}
                  >
                     Delete Workspace
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   )
};