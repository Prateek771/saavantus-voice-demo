export const INDUSTRIES = ["Healthcare", "Real estate", "Financial services", "Manufacturing", "Retail and ecommerce", "Technology", "Professional services", "Education", "Other"];
export const ORGANIZATION_SIZES = ["1–10", "11–50", "51–200", "201–500", "501–1,000", "1,001+"];
export type OrganizationProfile = {
  fullName: string; businessEmail: string; organization: string; industry: string;
  organizationSize: string; jobTitle: string; country: string; phone: string;
  applicableWorkflows: string; aiProductionWorkflows: string;
  dataConsent: boolean; marketingConsent: boolean;
};
export const emptyProfile: OrganizationProfile = {
  fullName: "", businessEmail: "", organization: "", industry: "", organizationSize: "",
  jobTitle: "", country: "India", phone: "", applicableWorkflows: "", aiProductionWorkflows: "",
  dataConsent: false, marketingConsent: false,
};
export const CONSENT_VERSION = "discovery-2026-10-23-v1";
export function validateProfile(input: unknown): {ok:true;value:OrganizationProfile}|{ok:false;errors:Record<string,string>} {
  const errors: Record<string,string> = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) return {ok:false,errors:{_form:"Complete your organization profile."}};
  const data = input as Record<string,unknown>;
  if (Object.keys(data).some(k => !(k in emptyProfile) || !Object.hasOwn(emptyProfile,k))) errors._form = "Unsupported profile field.";
  const value = {...emptyProfile};
  const required = ["fullName","businessEmail","organization","industry","organizationSize","jobTitle","country"];
  for (const key of Object.keys(emptyProfile) as (keyof OrganizationProfile)[]) {
    if (key === "dataConsent" || key === "marketingConsent") {
      if (typeof data[key] !== "boolean") errors[key] = "Choose a valid consent response.";
      value[key] = data[key] === true;
      continue;
    }
    const text = typeof data[key] === "string" ? data[key].trim() : "";
    const max = key === "businessEmail" ? 254 : key === "phone" ? 40 : 140;
    if ((data[key] !== undefined && typeof data[key] !== "string") || text.length > max || /[\u0000-\u001f\u007f]/.test(typeof data[key] === "string" ? data[key] : "")) errors[key] = `Use plain text, at most ${max} characters.`;
    if (required.includes(key) && !text) errors[key] = "Complete this field.";
    value[key] = text;
  }
  value.businessEmail = value.businessEmail.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.businessEmail)) errors.businessEmail = "Enter a valid business email.";
  if (!INDUSTRIES.includes(value.industry)) errors.industry = "Choose your industry.";
  if (!ORGANIZATION_SIZES.includes(value.organizationSize)) errors.organizationSize = "Choose your organization size.";
  if (value.phone && (!/^[+()\d .-]+$/.test(value.phone) || !/^\d{7,15}$/.test(value.phone.replace(/\D/g,"")))) errors.phone = "Use 7–15 digits, or leave blank.";
  for (const key of ["applicableWorkflows","aiProductionWorkflows"] as const) {
    if (value[key] && (!/^\d+$/.test(value[key]) || Number(value[key]) > 10_000_000)) errors[key] = "Enter a whole number from 0 to 10,000,000, or leave blank.";
    else if (value[key]) value[key] = String(Number(value[key]));
  }
  if (value.applicableWorkflows && value.aiProductionWorkflows && Number(value.aiProductionWorkflows)>Number(value.applicableWorkflows)) errors.aiProductionWorkflows = "Cannot exceed applicable workflows.";
  if (!value.dataConsent) errors.dataConsent = "Consent is required to store this assessment in Google Sheets.";
  return Object.keys(errors).length ? {ok:false,errors} : {ok:true,value};
}
