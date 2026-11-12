import { handleSubmission } from "@/lib/api";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  return handleSubmission(request, "contact", contactSchema);
}
