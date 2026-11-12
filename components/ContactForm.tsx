"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ZodError } from "zod";
import { contactSchema, fieldErrors } from "@/lib/validation";
import { Button } from "@/components/ui";
import { Field, FormNotice, inputClass, useSubmission } from "@/components/useSubmission";

const initial = { name: "", email: "", mobile: "", subject: "", message: "", consent: false, website: "" };

export function ContactForm() {
  const presetSubject = (useSearchParams().get("subject") ?? "").slice(0, 120);
  const [subjectEdited, setSubjectEdited] = useState(false);
  const [values, setValues] = useState(initial);
  const form = useSubmission("/api/contact");
  const subject = subjectEdited ? values.subject : presetSubject || values.subject;

  function update(name: keyof typeof initial, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = contactSchema.safeParse({ ...values, subject });
    if (!parsed.success) {
      form.setFieldErrors(fieldErrors(parsed.error as ZodError));
      return;
    }
    await form.submit({ ...values, subject });
  }

  if (form.status === "success") {
    return (
      <div role="status" className="rounded-3xl bg-white p-8 shadow-[0_20px_50px_-36px_rgba(21,25,29,0.5)]">
        <h2 className="font-display text-3xl tracking-tight text-ink">Message received</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{form.message}</p>
        {form.reference ? <p className="mt-3 text-sm font-medium text-ink">Reference {form.reference}</p> : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl bg-white p-6 shadow-[0_20px_50px_-36px_rgba(21,25,29,0.5)] sm:p-8" noValidate>
      <FormNotice status={form.status} message={form.message} />
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update("website", event.target.value)} />
        </label>
      </div>
      <Field id="name" label="Name" error={form.fieldErrors.name}>
        <input id="name" name="name" autoComplete="name" required value={values.name} onChange={(event) => update("name", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.name)} aria-describedby={form.fieldErrors.name ? "name-error" : undefined} />
      </Field>
      <Field id="email" label="Email" error={form.fieldErrors.email}>
        <input id="email" name="email" type="email" autoComplete="email" required value={values.email} onChange={(event) => update("email", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.email)} aria-describedby={form.fieldErrors.email ? "email-error" : undefined} />
      </Field>
      <Field id="mobile" label="Mobile number (optional)" error={form.fieldErrors.mobile}>
        <input id="mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel" value={values.mobile} onChange={(event) => update("mobile", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.mobile)} aria-describedby={form.fieldErrors.mobile ? "mobile-error" : undefined} />
      </Field>
      <Field id="subject" label="Subject" error={form.fieldErrors.subject}>
        <input id="subject" name="subject" required value={subject} onChange={(event) => { setSubjectEdited(true); update("subject", event.target.value); }} className={inputClass} aria-invalid={Boolean(form.fieldErrors.subject)} aria-describedby={form.fieldErrors.subject ? "subject-error" : undefined} />
      </Field>
      <Field id="message" label="Message" error={form.fieldErrors.message}>
        <textarea id="message" name="message" required rows={5} value={values.message} onChange={(event) => update("message", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.message)} aria-describedby={form.fieldErrors.message ? "message-error" : undefined} />
      </Field>
      <label className="flex items-start gap-3 text-sm leading-6 text-muted">
        <input type="checkbox" className="mt-1 h-5 w-5 accent-orange" checked={values.consent} onChange={(event) => update("consent", event.target.checked)} required />
        <span>
          I agree that NIRMANH360 may use these details to respond to this message.{" "}
          <Link href="/privacy-policy" className="font-medium text-orange-deep underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {form.fieldErrors.consent ? <p role="alert" className="text-sm text-[#9f2d20]">{form.fieldErrors.consent}</p> : null}
      <Button type="submit" disabled={form.status === "loading"}>
        {form.status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
