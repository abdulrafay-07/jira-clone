import { z } from "zod";

export const createWorkspaceSchema = z.object({
   name: z.string().trim().min(1, "Required"),
   image: z.union([
      z.custom((val) => {
         // Validate that `val` has a structure similar to a File
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

export const updateWorkspaceSchema = z.object({
   name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
   image: z.union([
      z.custom((val) => {
         // Validate that `val` has a structure similar to a File
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