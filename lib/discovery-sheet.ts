import { dimensions } from "./discovery.ts";
export const MODEL_VERSION = "discovery-rules-2026-10-23-v1";
export const DISCOVERY_HEADERS = [
  "request_id", "fingerprint", "submitted_at_utc", "full_name", "business_email", "organization", "industry", "organization_size", "job_title", "country", "phone", "applicable_workflows", "ai_production_workflows", "data_consent", "marketing_consent", "consent_version",
  ...dimensions.flatMap(d => d.questions.map((_,i) => `${d.name.toLowerCase().replaceAll(" ","_")}_answer_${i+1}`)),
  ...dimensions.flatMap(d => [`${d.name.toLowerCase().replaceAll(" ","_")}_score`, `${d.name.toLowerCase().replaceAll(" ","_")}_known`]),
  "readiness_score", "readiness_partial", "readiness_known", "adoption_score", "adoption_partial", "adoption_known", "workflow_ai_percentage", "model_version",
];
