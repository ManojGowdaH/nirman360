import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { ZodTypeAny } from "zod";
import { siteConfig } from "@/lib/config";
import { fieldErrors } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type SubmissionKind = "contact" | "partner" | "deletion";

const acceptedMessage: Record<SubmissionKind, string> = {
  contact:
    "Your message has been received. It is recorded for follow-up. This does not create a numbered support ticket.",
  partner:
    "Your partner enquiry has been received. Submitting this form does not publish a listing. Follow-up uses the details you provided.",
  deletion:
    "Your deletion request has been recorded. The account is not deleted by this form. Identity still needs to be verified, and some records may be kept where the law requires it.",
};

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const hostHeader = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !hostHeader) return false;
  try {
    return new URL(origin).host === hostHeader.split(",")[0].trim();
  } catch {
    return false;
  }
}

function notConfiguredMessage() {
  const base =
    "Nothing was submitted. The enquiry inbox is not connected yet. Add Supabase credentials or LEADS_WEBHOOK_URL as described in the project README.";
  return siteConfig.email ? `${base} You can also email ${siteConfig.email}.` : base;
}

function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT || "nirmanh360-website";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

function adminClient() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key || !url.startsWith("https://")) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function deliver(kind: SubmissionKind, payload: Record<string, unknown>, ipHash: string, id: string) {
  const supabase = adminClient();
  if (supabase) {
    const { error } = await supabase.from("website_requests").insert({
      id,
      kind,
      payload,
      ip_hash: ipHash,
      status: "received",
    });
    if (error) {
      console.error("Supabase insert failed", { kind, code: error.code });
      return false;
    }
    return true;
  }

  const webhook = process.env.LEADS_WEBHOOK_URL?.trim();
  if (!webhook) return null;
  let endpoint: URL;
  try {
    endpoint = new URL(webhook);
  } catch {
    return false;
  }
  if (endpoint.protocol !== "https:") return false;

  const secret = process.env.LEADS_WEBHOOK_SECRET?.trim();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify({
      id,
      kind,
      payload,
      ipHash,
      receivedAt: new Date().toISOString(),
    }),
    signal: AbortSignal.timeout(8000),
  });
  return response.ok;
}

export async function handleSubmission(request: Request, kind: SubmissionKind, schema: ZodTypeAny) {
  if (!isSameOrigin(request)) {
    return json({ ok: false, code: "FORBIDDEN", message: "This request was rejected." }, 403);
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > 20_000) {
    return json({ ok: false, code: "TOO_LARGE", message: "That submission is too large." }, 413);
  }

  const ip = clientIp(request);
  if (rateLimit(`${kind}:${ip}`)) {
    return json(
      { ok: false, code: "RATE_LIMITED", message: "Too many requests. Please wait a few minutes and try again." },
      429,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "INVALID", message: "The submission could not be read.", fields: {} }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ ok: false, code: "INVALID", message: "The submission could not be read.", fields: {} }, 400);
  }

  const record = body as Record<string, unknown>;
  if (typeof record.website === "string" && record.website.trim()) {
    return json({ ok: true, code: "ACCEPTED", message: acceptedMessage[kind], reference: crypto.randomUUID() });
  }

  const parsed = schema.safeParse(record);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        code: "INVALID",
        message: "Check the highlighted fields.",
        fields: fieldErrors(parsed.error),
      },
      400,
    );
  }

  const id = crypto.randomUUID();
  let delivered: boolean | null;
  try {
    delivered = await deliver(kind, parsed.data as Record<string, unknown>, hashIp(ip), id);
  } catch (error) {
    console.error("Submission delivery failed", {
      kind,
      name: error instanceof Error ? error.name : "Error",
    });
    delivered = false;
  }

  if (delivered === null) {
    return json({ ok: false, code: "NOT_CONFIGURED", message: notConfiguredMessage() }, 503);
  }

  if (!delivered) {
    return json(
      {
        ok: false,
        code: "UNAVAILABLE",
        message: "We could not record your request. Nothing was confirmed. Please try again later.",
      },
      502,
    );
  }

  return json({
    ok: true,
    code: "ACCEPTED",
    message: acceptedMessage[kind],
    reference: id,
  });
}
