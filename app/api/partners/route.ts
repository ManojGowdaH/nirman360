import { handleSubmission } from "@/lib/api";
import { partnerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  return handleSubmission(request, "partner", partnerSchema);
}
