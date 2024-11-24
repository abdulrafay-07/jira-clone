import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";
import { createWorkspaceSchema } from "@/features/workspaces/schema";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config";

const app = new Hono()
   .get("/", sessionMiddleware, async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const members = await databases.listDocuments(
         DATABASE_ID,
         MEMBERS_ID,
         [
            Query.equal("userId", user.$id),
         ],
      );

      if (members.total === 0) {
         return c.json({ data: { documents: [], total: 0 } });
      };

      const workspaceIds = members.documents.map((member) => member.workspaceId);

      const workspaces = await databases.listDocuments(
         DATABASE_ID,
         WORKSPACE_ID,
         [
            Query.orderAsc("$createdAt"),
            Query.contains("$id", workspaceIds),
         ],
      );

      return c.json({ data: workspaces });
   })
   .post("/", zValidator("form", createWorkspaceSchema), sessionMiddleware, async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");

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
               reconstructedFile, // Upload the reconstructed file object
            );
   
            const arrayBuffer = await storage.getFilePreview(
               IMAGES_BUCKET_ID,
               file.$id,
            );
   
            uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
         };
      };

      const workspace = await databases.createDocument(
         DATABASE_ID,
         WORKSPACE_ID,
         ID.unique(),
         {
            name,
            userId: user.$id,
            imageUrl: uploadedImageUrl,
            inviteCode: generateInviteCode(10),
         },
      );

      await databases.createDocument(
         DATABASE_ID,
         MEMBERS_ID,
         ID.unique(),
         {
            userId: user.$id,
            workspaceId: workspace.$id,
            role: MemberRole.ADMIN,
         },
      );

      return c.json({ data: workspace });
   });

export default app;