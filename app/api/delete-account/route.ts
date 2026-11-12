import { handleSubmission } from "@/lib/api";
import { deletionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  return handleSubmission(request, "deletion", deletionSchema);
}
