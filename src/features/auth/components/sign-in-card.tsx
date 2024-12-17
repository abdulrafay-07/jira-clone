"use client"

import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { loginSchema } from "@/features/auth/schema";
import { useLogin } from "@/features/auth/api/use-login";
import { signUpWithGithub } from "@/lib/oauth";

export const SignInCard = () => {
   const { mutate, isPending } = useLogin();

   const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const onSubmit = (data: z.infer<typeof loginSchema>) => {
      mutate({ json: data });
   };

   return (
      <Card className="w-full h-full md:w-[486px] border-none shadow-none">
         <CardHeader className="flex items-center justify-center text-center p-7">
            <CardTitle className="text-2xl">
               Welcome back!
            </CardTitle>
         </CardHeader>
         <div className="px-7">
            <DottedSeparator />
         </div>
         <CardContent className="p-7">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                     name="email"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input
                                 type="email"
                                 placeholder="Enter email address"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     name="password"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input
                                 type="password"
                                 placeholder="Enter password"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button disabled={isPending} size="lg" className="w-full">
                     Login
                  </Button>
               </form>
            </Form>
         </CardContent>
         <div className="px-7">
            <DottedSeparator />
         </div>
         <CardContent className="p-7 flex flex-col gap-y-4">
            <Button onClick={() => signUpWithGithub()} disabled={false} variant="secondary" size="lg" className="w-full">
               <FaGithub className="mr-2 size-5" />
               Login with GitHub
            </Button>
         </CardContent>
         <div className="px-7">
            <DottedSeparator />
         </div>
         <CardContent className="p-7 flex items-center justify-center">
            <p>
               Don&apos;t have an account?{" "}
               <Link href="/sign-up">
                  <span className="text-blue-700">Sign Up</span>
               </Link>
            </p>
         </CardContent>
      </Card>
   )
};