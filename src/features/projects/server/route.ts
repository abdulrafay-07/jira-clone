import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createProjectSchema, updateProjectSchema } from "@/features/projects/schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Project } from "@/features/projects/types";

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
   })
   .patch("/:projectId", zValidator("form", updateProjectSchema), sessionMiddleware, async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();

      const { name, image } = c.req.valid("form");

      const existingProject = await databases.getDocument<Project>(
         DATABASE_ID,
         PROJECTS_ID,
         projectId,
      );

      const member = await getMember({
         databases,
         userId: user.$id,
         workspaceId: existingProject.workspaceId,
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

      const project = await databases.updateDocument(
         DATABASE_ID,
         PROJECTS_ID,
         projectId,
         {
            name,
            imageUrl: uploadedImageUrl,
         }
      );

      return c.json({ data: project });
   })
   .delete("/:projectId", sessionMiddleware, async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { projectId } = c.req.param();

      const existingProject = await databases.getDocument<Project>(
         DATABASE_ID,
         PROJECTS_ID,
         projectId,
      );

      const member = await getMember({
         databases,
         userId: user.$id,
         workspaceId: existingProject.workspaceId,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      // TODO: delete tasks

      await databases.deleteDocument(
         DATABASE_ID,
         PROJECTS_ID,
         projectId,
      );

      return c.json({ data: { $id: existingProject.$id } });
   });

export default app;