import { z } from "zod";

export const createProjectSchema = z.object({
   name: z.string().trim().min(1, "Required"),
   image: z.union([
      z.custom((val) => {
         // validate that `val` has a structure similar to a File
         return (
            val &&
            typeof val === "object" &&
            "size" in val &&
            "type" in val &&
            typeof val.size === "number" &&
            typeof val.type === "string"
         );
      }, { message: "Invalid file" }),
      z.string().transform((value) => value === "" ? undefined : value),
   ]).optional(),
   workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
   name: z.string().trim().min(1, "Required").optional(),
   image: z.union([
      z.custom((val) => {
         // validate that `val` has a structure similar to a File
         return (
            val &&
            typeof val === "object" &&
            "size" in val &&
            "type" in val &&
            typeof val.size === "number" &&
            typeof val.type === "string"
         );
      }, { message: "Invalid file" }),
      z.string().transform((value) => value === "" ? undefined : value),
   ]).optional(),
});