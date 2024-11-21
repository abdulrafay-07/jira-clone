import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { loginSchema, signupSchema } from "@/features/auth/schema";

const app = new Hono()
   .post("/login", zValidator("json", loginSchema), (c) => {
      const { email, password } = c.req.valid("json");

      console.log(email, password)

      return c.json({ success: true });
   })
   .post("/signup", zValidator("json", signupSchema), (c) => {
      const { email, password, name } = c.req.valid("json");

      console.log(email, password)

      return c.json({ success: true });
   });

export default app;