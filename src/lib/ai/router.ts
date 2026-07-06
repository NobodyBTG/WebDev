/**
 * AI model router — ARCHITECTURE PLACEHOLDER (v1 uses mocks + rules).
 *
 * Every "intelligent" feature in the app calls through this router, so
 * swapping mock logic for real model calls later is a one-file change per
 * task, not a rebuild.
 *
 * Intended wiring when real AI is added:
 *
 *   - Create /src/app/api/ai/route.ts (Next.js route handler) that reads
 *     ANTHROPIC_API_KEY / OPENAI_API_KEY from env and proxies these tasks.
 *   - Each AiTask maps to a model tier; the route handler picks the actual
 *     model id per tier (config-driven, so pricing changes are one edit).
 *   - Responses are validated against the same TypeScript types the mock
 *     versions return, so the UI never knows the difference.
 *   - Credits are debited per task (see ../saas/credits.ts) BEFORE dispatch.
 */

export type ModelTier = "cheap" | "mid" | "deep";

export type AiTask =
  // Future AI route: cheap model
  | "classifyUserIntent" // classify raw industry input + free-text goals
  | "summarizeIntake" // turn intake answers into a natural-language profile
  | "generateFollowUpQuestions" // dynamic questions tailored to the industry
  | "categorizePainPoints" // replace keyword matcher in lib/painpoints.ts
  | "generateBasicBranches" // replace data/generic.ts template branches
  // Future AI route: mid model
  | "generateBetterBranches" // richer, industry-specific branch generation
  | "explainScores" // natural-language rationale for each metric score
  | "createValidationPlan" // bespoke plans (replaces lib/validation.ts templates)
  | "summarizeCompetitors" // digest manual competitor entries into strategy
  // Future AI route: deep research model
  | "deepMarketResearch" // live search demand, market size, trend analysis
  | "fullFinalReport" // long-form written business validation report
  | "complexCompetitorAnalysis" // scrape + analyze competitor sites/reviews
  | "strategicRecommendations"; // multi-branch portfolio strategy

export const TASK_TIER: Record<AiTask, ModelTier> = {
  classifyUserIntent: "cheap",
  summarizeIntake: "cheap",
  generateFollowUpQuestions: "cheap",
  categorizePainPoints: "cheap",
  generateBasicBranches: "cheap",
  generateBetterBranches: "mid",
  explainScores: "mid",
  createValidationPlan: "mid",
  summarizeCompetitors: "mid",
  deepMarketResearch: "deep",
  fullFinalReport: "deep",
  complexCompetitorAnalysis: "deep",
  strategicRecommendations: "deep",
};

export interface AiRequest<TPayload = unknown> {
  task: AiTask;
  payload: TPayload;
}

export interface AiResponse<TResult = unknown> {
  task: AiTask;
  tier: ModelTier;
  /** v1: always "mock". Later: the actual model id used. */
  model: string;
  result: TResult;
}

/**
 * Dispatch an AI task.
 *
 * v1 behavior: returns a mock envelope; callers use local rule-based logic.
 * The UI already calls the rule-based modules directly — this function
 * exists so the seam is established and typed.
 */
export async function runAiTask<TPayload, TResult>(
  request: AiRequest<TPayload>,
  mockResult: TResult
): Promise<AiResponse<TResult>> {
  const tier = TASK_TIER[request.task];

  // Future implementation sketch:
  //
  //   const res = await fetch("/api/ai", {
  //     method: "POST",
  //     body: JSON.stringify(request),
  //   });
  //   return res.json();
  //
  // The /api/ai handler would:
  //   1. Authenticate the user (Supabase session)        // Future: user accounts
  //   2. Debit credits for the task                      // Future: credit system
  //   3. Route to the model for `tier`                   // Future: model routing
  //   4. Validate/parse the model output into TResult

  return {
    task: request.task,
    tier,
    model: "mock",
    result: mockResult,
  };
}
