"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DottedSeparator } from "@/components/dotted-separator";
import {
   Avatar,
   AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";

import { useDeleteProject } from "@/features/projects/api/use-delete-project";
import { useUpdateProject } from "@/features/projects/api/use-update-project";
import { updateProjectSchema } from "@/features/projects/schema";
import { Project } from "@/features/projects/types";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";

interface EditProjectFormProps {
   onCancel?: () => void;
   initialValues: Project;
};

export const EditProjectForm = ({
   onCancel,
   initialValues,
}: EditProjectFormProps) => {
   const { mutate, isPending } = useUpdateProject();
   const { mutate: deleteProject, isPending: isDeletingProject } = useDeleteProject();
   const [DeleteDialog, confirmDelete] = useConfirm(
      "Delete Project",
      "This action cannot be undone",
      "destructive",
   );

   const router = useRouter();
   const inputRef = useRef<HTMLInputElement>(null);

   const form = useForm<z.infer<typeof updateProjectSchema>>({
      resolver: zodResolver(updateProjectSchema),
      defaultValues: {
         ...initialValues,
         image: initialValues.imageUrl ?? "",
      },
   });

   const onSubmit = (data: z.infer<typeof updateProjectSchema>) => {
      const finalData = {
         ...data,
         image: data.image instanceof File ? data.image : "",
      };

      mutate({
         form: finalData,
         param: { projectId: initialValues.$id },
      }, {
         onSuccess: () => {
            form.reset();
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

      deleteProject({
         param: {
            projectId: initialValues.$id,
         },
      }, {
         onSuccess: () => {
            window.location.href = `/workspaces/${initialValues.workspaceId}`;
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
                  onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)}
               >
                  <ArrowLeftIcon className="size-4" /> Back
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
                                 <FormLabel>Project Name</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Enter project name"
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
                                       <p className="text-sm">Project Icon</p>
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
                     Deleting a project is irreversible and will remove all associated data.
                  </p>
                  <DottedSeparator className="py-7" />
                  <Button
                     size="sm"
                     variant="destructive"
                     className="mt-6 w-fit ml-auto"
                     type="button"
                     disabled={isPending || isDeletingProject}
                     onClick={handleDelete}
                  >
                     Delete Project
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   )
};