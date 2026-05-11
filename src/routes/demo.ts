import { existsSync } from "node:fs";
import { join } from "node:path";
import express, { Router } from "express";

const FRONTEND_DIST_PATH = join(process.cwd(), "frontend", "dist");
const FRONTEND_ASSETS_PATH = join(FRONTEND_DIST_PATH, "assets");
const FRONTEND_INDEX_PATH = join(FRONTEND_DIST_PATH, "index.html");

function notBuiltHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>voya demo not built</title>
    <style>
      body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; color: #0f172a; }
      main { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
      section { max-width: 640px; border: 1px solid #e2e8f0; background: white; border-radius: 18px; padding: 28px; box-shadow: 0 20px 60px rgba(15,23,42,0.08); }
      h1 { margin: 0 0 8px; font-size: 28px; }
      p { margin: 0 0 18px; color: #475569; line-height: 1.6; }
      code { background: #eef2ff; color: #3730a3; padding: 3px 6px; border-radius: 6px; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <h1>voya demo is not built yet.</h1>
        <p>The API is running. Build the frontend, then refresh this page.</p>
        <code>npm run build:frontend</code>
      </section>
    </main>
  </body>
</html>`;
}

export function createDemoRouter(): Router {
  const router = Router();

  const sendDemoIndex = (_req: express.Request, res: express.Response) => {
    if (existsSync(FRONTEND_INDEX_PATH)) {
      res.sendFile(FRONTEND_INDEX_PATH);
      return;
    }

    res.status(200).type("html").send(notBuiltHtml());
  };

  router.get("/demo", sendDemoIndex);
  router.get("/demo/", sendDemoIndex);
  router.use("/demo/assets", express.static(FRONTEND_ASSETS_PATH, { index: false, redirect: false }));

  router.get(/^\/demo\/(?!assets\/).*/, (_req, res) => {
    if (existsSync(FRONTEND_INDEX_PATH)) {
      res.sendFile(FRONTEND_INDEX_PATH);
      return;
    }

    res.status(200).type("html").send(notBuiltHtml());
  });

  return router;
}
