"use client";

import { useState } from "react";

export type FormStatus = "idle" | "loading" | "success" | "not_configured" | "error";

export function useSubmission(endpoint: string) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function submit(body: Record<string, unknown>) {
    setStatus("loading");
    setMessage("");
    setReference("");
    setFieldErrors({});
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
        reference?: string;
        fields?: Record<string, string>;
      };
      if (data.code === "INVALID") {
        setStatus("error");
        setFieldErrors(data.fields ?? {});
        setMessage(data.message || "Check the highlighted fields.");
        return data.fields ?? {};
      }
      if (data.code === "NOT_CONFIGURED") {
        setStatus("not_configured");
        setMessage(data.message || "Nothing was submitted. The inbox is not connected yet.");
        return {};
      }
      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message || "We could not send that. Please try again.");
        return {};
      }
      setStatus("success");
      setMessage(data.message || "Received.");
      setReference(data.reference || "");
      return {};
    } catch {
      setStatus("error");
      setMessage("We could not reach the server. Please try again.");
      return {};
    }
  }

  return { status, message, reference, fieldErrors, setFieldErrors, submit };
}

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-[#9f2d20]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-orange aria-[invalid=true]:border-[#9f2d20]";

export function FormNotice({
  status,
  message,
  reference,
}: {
  status: FormStatus;
  message: string;
  reference?: string;
}) {
  if (status === "idle" || status === "loading" || !message) return null;
  const tone =
    status === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : status === "not_configured"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-red-200 bg-red-50 text-red-950";
  return (
    <div role="status" className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${tone}`}>
      <p>{message}</p>
      {reference ? <p className="mt-2 font-medium">Reference {reference}</p> : null}
    </div>
  );
}
