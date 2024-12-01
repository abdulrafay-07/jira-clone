import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createProjectSchema } from "@/features/projects/schema";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
   .get("/", zValidator("query", z.object({ workspaceId: z.string() })), sessionMiddleware, async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
         databases,
         workspaceId,
         userId: user.$id,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      const projects = await databases.listDocuments(
         DATABASE_ID,
         PROJECTS_ID,
         [
            Query.equal("workspaceId", workspaceId),
            Query.orderDesc("$createdAt"),
         ],
      );

      return c.json({ data: projects });
   })
   .post("/", zValidator("form", createProjectSchema), sessionMiddleware, async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image, workspaceId } = c.req.valid("form");

      const member = getMember({
         databases,
         workspaceId,
         userId: user.$id,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      let uploadedImageUrl: string | undefined;

      if (image) {
         if (image instanceof File) {
            const file = await storage.createFile(
               IMAGES_BUCKET_ID,
               ID.unique(),
               image,
            );
   
            const arrayBuffer = await storage.getFilePreview(
               IMAGES_BUCKET_ID,
               file.$id,
            );
   
            uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
         } else if (typeof image === "object") {
            const reconstructedFile = new File(
               [Buffer.from(await image.arrayBuffer())],
               "uploaded-file.jpg",
               { type: image.type }
            );
   
            const file = await storage.createFile(
               IMAGES_BUCKET_ID,
               ID.unique(),
               reconstructedFile, // upload the reconstructed file object
            );
   
            const arrayBuffer = await storage.getFilePreview(
               IMAGES_BUCKET_ID,
               file.$id,
            );
   
            uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
         };
      };

      const project = await databases.createDocument(
         DATABASE_ID,
         PROJECTS_ID,
         ID.unique(),
         {
            name,
            workspaceId,
            imageUrl: uploadedImageUrl,
         },
      );

      return c.json({ data: project });
   });

export default app;