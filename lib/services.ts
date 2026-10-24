export const services = [
  {
    id: "workflow",
    title: "AI Workflow Automation",
    summary:
      "Connect the steps between an incoming request and completed work.",
    description:
      "Turn a repeated, multi-step task into a workflow with clear triggers, decisions and handoffs. Use AI where interpretation helps, with explicit rules and review for the decisions that matter.",
    deliverables: [
      "A process map with triggers, owners and exception paths",
      "Workflow implementation for agreed systems and data",
      "Validation, retries and an operational handover",
    ],
    benefits: [
      "Less copying between tools",
      "Visible status for each step",
      "A defined route when something needs attention",
    ],
    useCases: [
      "Lead routing",
      "Invoice intake and review",
      "Employee onboarding",
    ],
  },
  {
    id: "agents",
    title: "AI Agent Development",
    summary: "Give a focused business role an agent with clear boundaries.",
    description:
      "Build voice or text agents around a specific job, approved knowledge and a defined set of tools. Agree what the agent can do, what needs confirmation and when a person takes over.",
    deliverables: [
      "A role, knowledge scope and tool permissions",
      "Conversation or task flows with human handoff",
      "Scenario testing and a review process for agent outputs",
    ],
    benefits: [
      "Consistent handling of routine requests",
      "Useful context for the receiving team",
      "Human review at agreed decision points",
    ],
    useCases: [
      "Voice enquiry assistants",
      "Research copilots",
      "Internal knowledge assistants",
    ],
  },
  {
    id: "bpa",
    title: "Business Process Automation",
    summary:
      "Make approvals, records and recurring operations easier to manage.",
    description:
      "Map the work your team repeats, remove unnecessary steps and automate the parts with clear rules. Keep ownership, approvals and exceptions visible throughout the process.",
    deliverables: [
      "A documented process and responsibility map",
      "Approval routes, reminders and document templates",
      "Activity records and exception handling",
    ],
    benefits: [
      "A repeatable way to complete routine work",
      "Fewer handoffs waiting without an owner",
      "Records your team can inspect",
    ],
    useCases: [
      "Purchase approvals",
      "Document generation",
      "Inventory notifications",
    ],
  },
  {
    id: "support",
    title: "Intelligent Support Automation",
    summary:
      "Handle familiar questions and give complex issues a useful handoff.",
    description:
      "Bring approved support knowledge, request classification and ticket routing into one flow. Help customers find routine answers while keeping sensitive or unresolved issues with the right people.",
    deliverables: [
      "An approved knowledge and answer scope",
      "Ticket classification, routing and escalation rules",
      "Response review and knowledge maintenance workflows",
    ],
    benefits: [
      "Less repeated triage for support teams",
      "Consistent answers from reviewed information",
      "Escalations with the conversation attached",
    ],
    useCases: [
      "FAQ assistants",
      "Ticket categorisation",
      "Draft support replies",
    ],
  },
  {
    id: "integration",
    title: "AI Integration Services",
    summary: "Bring AI into the tools and information your team already uses.",
    description:
      "Add an AI capability to an existing application or connect agreed systems through their APIs. Define the data contract, access rules and failure behaviour before information moves between them.",
    deliverables: [
      "An integration design and data mapping",
      "API connections with scoped access and validation",
      "Failure alerts, recovery rules and handover notes",
    ],
    benefits: [
      "Less fragmented information",
      "AI features within familiar workflows",
      "Clear boundaries around data access",
    ],
    useCases: [
      "CRM enrichment with review",
      "Document data extraction",
      "Custom API connections",
    ],
  },
  {
    id: "saas",
    title: "SaaS Operations Automation",
    summary:
      "Connect onboarding, account activity and recurring customer operations.",
    description:
      "Design workflows around the customer lifecycle, from a new signup to account changes and renewal follow-up. Keep product events, account records and operational actions in step.",
    deliverables: [
      "A customer lifecycle and event map",
      "Onboarding, provisioning or billing sync workflows",
      "Reconciliation checks and operational alerts",
    ],
    benefits: [
      "More consistent customer onboarding",
      "Fewer manual account updates",
      "Earlier visibility into follow-up needs",
    ],
    useCases: [
      "Account provisioning",
      "Billing data reconciliation",
      "Usage and renewal alerts",
    ],
  },
  {
    id: "consulting",
    title: "Enterprise Automation Consulting",
    summary: "Choose where to start and give delivery a practical roadmap.",
    description:
      "Assess your processes, systems and team constraints before committing to a build. Prioritise opportunities by effort, value and risk, with a plan your stakeholders can review.",
    deliverables: [
      "A current-state workflow and systems assessment",
      "A prioritised roadmap with assumptions and dependencies",
      "A pilot scope, success measures and team guidance",
    ],
    benefits: [
      "A clearer first project",
      "Tradeoffs visible before investment",
      "Shared ownership across business and technical teams",
    ],
    useCases: [
      "Automation audits",
      "Vendor evaluation",
      "Team training and adoption",
    ],
  },
  {
    id: "cloud",
    title: "AWS Cloud & Infrastructure Automation",
    summary:
      "Make cloud setup and operations repeatable, observable and reviewable.",
    description:
      "Plan AWS architecture and automate infrastructure provisioning and routine operations. Match the environment to your workload, with access controls, cost visibility and recovery procedures that can be tested.",
    deliverables: [
      "An architecture and infrastructure-as-code setup",
      "Deployment, monitoring and cost alert workflows",
      "Backup, restore and operational runbooks",
    ],
    benefits: [
      "Repeatable environment changes",
      "Better visibility into resource use and spend",
      "Documented recovery and maintenance steps",
    ],
    useCases: [
      "AWS environment provisioning",
      "Scaling policies and cost alerts",
      "Backup and restore checks",
    ],
  },
] as const;
