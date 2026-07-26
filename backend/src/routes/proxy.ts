import { Router, Request, Response } from "express";

// ---------------------------------------------------------------------------
// Proxy Route — fetches a target URL server-side and returns the body as
// text/html, stripping X-Frame-Options and CSP headers so the frontend can
// embed the result in an iframe.
// ---------------------------------------------------------------------------

const router = Router();

router.get("/proxy/website", async (req: Request, res: Response) => {
  const url = req.query.url as string | undefined;

  if (!url) {
    res.status(400).json({ error: "Missing required query parameter: url" });
    return;
  }

  // Basic validation: only allow http and https
  if (!/^https?:\/\//i.test(url)) {
    res.status(400).json({ error: "URL must start with http:// or https://" });
    return;
  }

  try {
    const upstream = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Pro4-Proxy/1.0",
      },
    });

    // Read the body as text
    const body = await upstream.text();

    // Copy headers from upstream, but strip X-Frame-Options and CSP
    const blocked = new Set([
      "x-frame-options",
      "content-security-policy",
      "content-security-policy-report-only",
    ]);

    upstream.headers.forEach((value, key) => {
      if (!blocked.has(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    // Always set our own content-type to text/html so the iframe renders it
    res.status(200).type("text/html").send(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(502).json({ error: `Failed to fetch upstream URL: ${message}` });
  }
});

export default router;