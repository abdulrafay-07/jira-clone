import { z } from "zod";

export const createWorkspaceSchema = z.object({
   name: z.string().trim().min(1, "Required"),
   image: z.custom((val) => {
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
});