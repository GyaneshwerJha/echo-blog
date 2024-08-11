
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const authMiddleware = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

authMiddleware.use(async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({
      error: "Unauthorized",
    });
  }

  const token = jwt.split(" ")[1];
  const payload = await verify(token, c.env.JWT_SECRET);
  if (!payload || !payload?.id) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }

  const payloadId : any = payload?.id;

  c.set("userId", payloadId);
  await next();
});
