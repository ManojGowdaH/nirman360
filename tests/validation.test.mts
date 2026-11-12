import assert from "node:assert/strict";
import test from "node:test";
import { contactSchema, deletionSchema, partnerSchema } from "../lib/validation.ts";

const partner = {
  fullName: "Asha Rao",
  mobile: "+91 98450 11223",
  email: "",
  businessName: "",
  partnerType: "equipment_owner",
  city: "Bengaluru",
  area: "Whitefield",
  resourceCategory: "Commercial vehicles",
  description: "Two excavators available for hire around east Bengaluru.",
  consent: true,
};

test("normalises an Indian mobile number", () => {
  const parsed = partnerSchema.parse(partner);
  assert.equal(parsed.mobile, "9845011223");
});

test("rejects a short mobile number", () => {
  const result = partnerSchema.safeParse({ ...partner, mobile: "98450" });
  assert.equal(result.success, false);
});

test("accepts a blank optional email and rejects a bad one", () => {
  assert.equal(partnerSchema.parse(partner).email, "");
  const bad = partnerSchema.safeParse({ ...partner, email: "not-an-email" });
  assert.equal(bad.success, false);
});

test("requires consent", () => {
  const result = contactSchema.safeParse({
    name: "Ravi",
    email: "ravi@example.com",
    mobile: "",
    subject: "Materials",
    message: "I need cement for a house in Bengaluru.",
    consent: false,
  });
  assert.equal(result.success, false);
});

test("strips markup from stored text", () => {
  const parsed = deletionSchema.parse({
    mobile: "9845011223",
    email: "owner@example.com",
    accountType: "customer",
    reason: "<script>alert(1)</script> Please delete",
    confirmation: true,
  });
  assert.equal(parsed.reason.includes("<"), false);
  assert.match(parsed.reason, /Please delete/);
});
