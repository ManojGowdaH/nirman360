"use client";

import { useState } from "react";
import Link from "next/link";
import { ZodError } from "zod";
import { accountTypes, deletionSchema, fieldErrors } from "@/lib/validation";
import { Button } from "@/components/ui";
import { Field, FormNotice, inputClass, useSubmission } from "@/components/useSubmission";

const initial = {
  mobile: "",
  email: "",
  accountType: "",
  reason: "",
  confirmation: false,
  website: "",
};

export function AccountDeletionForm() {
  const [values, setValues] = useState(initial);
  const form = useSubmission("/api/delete-account");

  function update(name: keyof typeof initial, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = deletionSchema.safeParse(values);
    if (!parsed.success) {
      form.setFieldErrors(fieldErrors(parsed.error as ZodError));
      return;
    }
    await form.submit(values);
  }

  if (form.status === "success") {
    return (
      <div role="status" className="rounded-3xl bg-white p-8">
        <h2 className="font-display text-3xl tracking-tight text-ink">Deletion request recorded</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{form.message}</p>
        {form.reference ? <p className="mt-3 text-sm font-medium text-ink">Reference {form.reference}</p> : null}
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Keep this reference if you need to ask about the request. Account access is not removed by the form itself.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl bg-white p-6 sm:p-8" noValidate>
      <FormNotice status={form.status} message={form.message} />
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update("website", event.target.value)} />
        </label>
      </div>
      <Field id="registered-mobile" label="Registered mobile number" error={form.fieldErrors.mobile}>
        <input id="registered-mobile" type="tel" inputMode="tel" autoComplete="tel" required value={values.mobile} onChange={(event) => update("mobile", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.mobile)} aria-describedby={form.fieldErrors.mobile ? "registered-mobile-error" : undefined} />
      </Field>
      <Field id="registered-email" label="Registered email address (optional)" error={form.fieldErrors.email}>
        <input id="registered-email" type="email" autoComplete="email" value={values.email} onChange={(event) => update("email", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.email)} aria-describedby={form.fieldErrors.email ? "registered-email-error" : undefined} />
      </Field>
      <Field id="accountType" label="Account type" error={form.fieldErrors.accountType}>
        <select id="accountType" required value={values.accountType} onChange={(event) => update("accountType", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.accountType)} aria-describedby={form.fieldErrors.accountType ? "accountType-error" : undefined}>
          <option value="">Select</option>
          {accountTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </Field>
      <Field id="reason" label="Reason for deletion (optional)" error={form.fieldErrors.reason}>
        <textarea id="reason" rows={4} value={values.reason} onChange={(event) => update("reason", event.target.value)} className={inputClass} />
      </Field>
      <label className="flex items-start gap-3 text-sm leading-6 text-muted">
        <input type="checkbox" className="mt-1 h-5 w-5 accent-orange" checked={values.confirmation} onChange={(event) => update("confirmation", event.target.checked)} required />
        <span>
          I understand this submits a deletion request. It does not by itself delete the account until the request is verified and processed. See the{" "}
          <Link href="/privacy-policy" className="font-medium text-orange-deep underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {form.fieldErrors.confirmation ? (
        <p role="alert" className="text-sm text-[#9f2d20]">
          {form.fieldErrors.confirmation}
        </p>
      ) : null}
      <Button type="submit" variant="dark" disabled={form.status === "loading"}>
        {form.status === "loading" ? "Sending…" : "Submit deletion request"}
      </Button>
    </form>
  );
}
