import { z } from "zod";

export const resourceCategories = [
  "Commercial vehicles",
  "Construction materials",
  "Heavy equipment",
  "Power tools and electrical equipment",
  "Scaffolding, ladders and safety equipment",
] as const;

export const partnerTypes = [
  { value: "equipment_owner", label: "Equipment owner" },
  { value: "material_supplier", label: "Material supplier" },
] as const;

export const accountTypes = [
  { value: "customer", label: "Customer" },
  { value: "equipment_owner", label: "Equipment owner" },
  { value: "material_supplier", label: "Material supplier" },
  { value: "not_sure", label: "Not sure" },
] as const;

export function cleanText(value: string, max: number) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, max);
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

const requiredText = (min: number, max: number, message: string) =>
  z.preprocess(
    asString,
    z
      .string()
      .transform((value) => cleanText(value, max))
      .refine((value) => value.length >= min, message),
  );

const optionalText = (max: number) =>
  z.preprocess(
    asString,
    z.string().transform((value) => cleanText(value, max)),
  );

export const mobileSchema = z.preprocess(asString, z.string().transform((value) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}).refine((value) => /^[6-9]\d{9}$/.test(value), "Enter a 10-digit Indian mobile number."));

const optionalEmail = z.preprocess(
  asString,
  z
    .string()
    .transform((value) => value.trim().toLowerCase().slice(0, 120))
    .refine(
      (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Enter a valid email address.",
    ),
);

const requiredEmail = z.preprocess(
  asString,
  z
    .string()
    .transform((value) => value.trim().toLowerCase().slice(0, 120))
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Enter a valid email address."),
);

const consent = z.preprocess(
  (value) => value === true,
  z.boolean().refine((value) => value, "Please confirm to continue."),
);

export const contactSchema = z.object({
  name: requiredText(2, 80, "Enter your name."),
  email: requiredEmail,
  mobile: z.preprocess(asString, z.string().transform((value) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
    return digits;
  }).refine(
    (value) => value === "" || /^[6-9]\d{9}$/.test(value),
    "Enter a 10-digit Indian mobile number, or leave this blank.",
  )),
  subject: requiredText(3, 120, "Enter a subject."),
  message: requiredText(10, 2000, "Enter a message of at least 10 characters."),
  consent,
});

export const partnerSchema = z.object({
  fullName: requiredText(2, 80, "Enter your full name."),
  mobile: mobileSchema,
  email: optionalEmail,
  businessName: optionalText(120),
  partnerType: z.preprocess(
    asString,
    z.enum(["equipment_owner", "material_supplier"], {
      errorMap: () => ({ message: "Select a partner type." }),
    }),
  ),
  city: requiredText(2, 60, "Enter your city."),
  area: requiredText(2, 80, "Enter your area."),
  resourceCategory: z.preprocess(
    asString,
    z.enum(resourceCategories, { errorMap: () => ({ message: "Select a resource category." }) }),
  ),
  description: requiredText(20, 1000, "Describe the resources in at least 20 characters."),
  consent,
});

export const deletionSchema = z.object({
  mobile: mobileSchema,
  email: optionalEmail,
  accountType: z.preprocess(
    asString,
    z.enum(["customer", "equipment_owner", "material_supplier", "not_sure"], {
      errorMap: () => ({ message: "Select an account type." }),
    }),
  ),
  reason: optionalText(500),
  confirmation: z.preprocess(
    (value) => value === true,
    z.boolean().refine((value) => value, "Confirm that you want to request account deletion."),
  ),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type DeletionInput = z.infer<typeof deletionSchema>;

export function fieldErrors(error: z.ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}
