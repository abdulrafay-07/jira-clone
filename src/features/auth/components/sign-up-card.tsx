"use client"

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
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

import { FaGithub } from "react-icons/fa";

import { useSignup } from "@/features/auth/api/use-signup";
import { signupSchema } from "@/features/auth/schema";
import { signUpWithGithub } from "@/lib/oauth";

export const SignUpCard = () => {
   const { mutate, isPending } = useSignup();

   const form = useForm<z.infer<typeof signupSchema>>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
      },
   });

   const onSubmit = (data: z.infer<typeof signupSchema>) => {
      mutate({ json: data });
   };
   
   return (
      <Card className="w-full h-full md:w-[486px] border-none shadow-none">
         <CardHeader className="flex items-center justify-center text-center p-7">
            <CardTitle className="text-2xl">
               Sign Up
            </CardTitle>
            <CardDescription>
               By signing up, you agree to our{" "}
               <Link href="/privacy">
                  <span className="text-blue-700">Privacy Policy</span>
               </Link>{" "}
               and{" "}
               <Link href="/terms">
                  <span className="text-blue-700">Terms of Service</span>
               </Link>
            </CardDescription>
         </CardHeader>
         <div className="px-7">
            <DottedSeparator />
         </div>
         <CardContent className="p-7">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                     name="name"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input
                                 type="text"
                                 placeholder="Enter name"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
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
                     Sign Up
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
               Already have an account?{" "}
               <Link href="/sign-in">
                  <span className="text-blue-700">Login</span>
               </Link>
            </p>
         </CardContent>
      </Card>
   )
};