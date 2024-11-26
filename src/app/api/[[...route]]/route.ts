import { Hono } from "hono";
import { handle } from "hono/vercel";

import authRoute from "@/features/auth/server/route";
import workspacesRoute from "@/features/workspaces/server/route";
import membersRoute from "@/features/members/server/route";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
   .route("/auth", authRoute)
   .route("/workspaces", workspacesRoute)
   .route("/members", membersRoute);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;