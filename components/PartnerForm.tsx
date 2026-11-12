"use client";

import { useState } from "react";
import Link from "next/link";
import { ZodError } from "zod";
import { fieldErrors, partnerSchema, partnerTypes, resourceCategories } from "@/lib/validation";
import { Button } from "@/components/ui";
import { Field, FormNotice, inputClass, useSubmission } from "@/components/useSubmission";

const initial = {
  fullName: "",
  mobile: "",
  email: "",
  businessName: "",
  partnerType: "",
  city: "",
  area: "",
  resourceCategory: "",
  description: "",
  consent: false,
  website: "",
};

export function PartnerForm() {
  const [values, setValues] = useState(initial);
  const form = useSubmission("/api/partners");

  function update(name: keyof typeof initial, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = partnerSchema.safeParse(values);
    if (!parsed.success) {
      form.setFieldErrors(fieldErrors(parsed.error as ZodError));
      return;
    }
    await form.submit(values);
  }

  if (form.status === "success") {
    return (
      <div role="status" className="rounded-3xl bg-white p-8">
        <h2 className="font-display text-3xl tracking-tight text-ink">Enquiry received</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{form.message}</p>
        {form.reference ? <p className="mt-3 text-sm font-medium text-ink">Reference {form.reference}</p> : null}
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fullName" label="Full name" error={form.fieldErrors.fullName}>
          <input id="fullName" name="name" autoComplete="name" required value={values.fullName} onChange={(event) => update("fullName", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.fullName)} aria-describedby={form.fieldErrors.fullName ? "fullName-error" : undefined} />
        </Field>
        <Field id="mobile" label="Mobile number" error={form.fieldErrors.mobile}>
          <input id="mobile" name="tel" type="tel" inputMode="tel" autoComplete="tel" required value={values.mobile} onChange={(event) => update("mobile", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.mobile)} aria-describedby={form.fieldErrors.mobile ? "mobile-error" : undefined} />
        </Field>
        <Field id="email" label="Email address (optional)" error={form.fieldErrors.email}>
          <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={(event) => update("email", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.email)} aria-describedby={form.fieldErrors.email ? "email-error" : undefined} />
        </Field>
        <Field id="businessName" label="Business name (optional)" error={form.fieldErrors.businessName}>
          <input id="businessName" name="organization" autoComplete="organization" value={values.businessName} onChange={(event) => update("businessName", event.target.value)} className={inputClass} />
        </Field>
        <Field id="partnerType" label="Partner type" error={form.fieldErrors.partnerType}>
          <select id="partnerType" required value={values.partnerType} onChange={(event) => update("partnerType", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.partnerType)} aria-describedby={form.fieldErrors.partnerType ? "partnerType-error" : undefined}>
            <option value="">Select</option>
            {partnerTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="resourceCategory" label="Resource category" error={form.fieldErrors.resourceCategory}>
          <select id="resourceCategory" required value={values.resourceCategory} onChange={(event) => update("resourceCategory", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.resourceCategory)} aria-describedby={form.fieldErrors.resourceCategory ? "resourceCategory-error" : undefined}>
            <option value="">Select</option>
            {resourceCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>
        <Field id="city" label="City" error={form.fieldErrors.city}>
          <input id="city" autoComplete="address-level2" required placeholder="Bengaluru" value={values.city} onChange={(event) => update("city", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.city)} aria-describedby={form.fieldErrors.city ? "city-error" : undefined} />
        </Field>
        <Field id="area" label="Area" error={form.fieldErrors.area}>
          <input id="area" required value={values.area} onChange={(event) => update("area", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.area)} aria-describedby={form.fieldErrors.area ? "area-error" : undefined} />
        </Field>
      </div>
      <Field id="description" label="Short description" error={form.fieldErrors.description}>
        <textarea id="description" required rows={5} value={values.description} onChange={(event) => update("description", event.target.value)} className={inputClass} aria-invalid={Boolean(form.fieldErrors.description)} aria-describedby={form.fieldErrors.description ? "description-error" : undefined} />
      </Field>
      <label className="flex items-start gap-3 text-sm leading-6 text-muted">
        <input type="checkbox" className="mt-1 h-5 w-5 accent-orange" checked={values.consent} onChange={(event) => update("consent", event.target.checked)} required />
        <span>
          I agree that NIRMANH360 may use these details to respond to this partner enquiry.{" "}
          <Link href="/privacy-policy" className="font-medium text-orange-deep underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {form.fieldErrors.consent ? <p role="alert" className="text-sm text-[#9f2d20]">{form.fieldErrors.consent}</p> : null}
      <Button type="submit" disabled={form.status === "loading"}>
        {form.status === "loading" ? "Sending…" : "Submit enquiry"}
      </Button>
    </form>
  );
}
