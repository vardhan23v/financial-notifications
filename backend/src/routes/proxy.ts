import { Router, Request, Response } from "express";
import { URL } from "url";

// ---------------------------------------------------------------------------
// Proxy Route — fetches a target URL server-side and returns the body as
// text/html, stripping X-Frame-Options and CSP headers so the frontend can
// embed the result in an iframe.
// ---------------------------------------------------------------------------

const router = Router();

router.get("/website", async (req: Request, res: Response) => {
  const url = req.query.url as string | undefined;

  if (!url) {
    res.status(400).json({ error: "Missing required query parameter: url" });
    return;
  }

  // Validate: only allow http and https
  if (!/^https?:\/\//i.test(url)) {
    res.status(400).json({ error: "URL must start with http:// or https://" });
    return;
  }

  // Parse the URL and reject private / loopback addresses
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    res.status(400).json({ error: "Invalid URL" });
    return;
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost variants
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "0.0.0.0") {
    res.status(400).json({ error: "Requests to localhost are not allowed" });
    return;
  }

  // Block private IPv4 ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
  const ipv4Match = hostname.match(
    /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
  );
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    if (a === 10) {
      res.status(400).json({ error: "Requests to private networks are not allowed" });
      return;
    }
    if (a === 172 && b >= 16 && b <= 31) {
      res.status(400).json({ error: "Requests to private networks are not allowed" });
      return;
    }
    if (a === 192 && b === 168) {
      res.status(400).json({ error: "Requests to private networks are not allowed" });
      return;
    }
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

    // Explicitly remove helmet-set headers that would block iframe embedding
    res.removeHeader("X-Frame-Options");
    res.removeHeader("Content-Security-Policy");

    // Use upstream Content-Type, default to text/html
    const contentType = upstream.headers.get("content-type") || "text/html";
    res.status(200).type(contentType).send(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(502).json({ error: `Failed to fetch upstream URL: ${message}` });
  }
});

export default router;