import type { InsightDetailData } from "@/types/insight-detail";

/**
 * EN article registry (/en/insights) — translation of `insights-detail-data.ts`.
 * Same slugs, same structure, same editorial charter: method guides illustrated
 * by typical scenarios, never presented as client engagements, no client figures.
 */

const AUTHOR = { name: "Martial GNINHI", role: "Founder, Analyticatech", avatarInitials: "MG" };
const REVISED = "Revised on 2 November 2026";

const RESULTS_LEAD =
  "Typical scenario: these indicators are used to judge a go-live. They are measured on your own scope, with a baseline recorded during scoping.";
const RESULTS_SUBTEXT = "Baseline recorded during scoping, then tracked at each milestone.";
const METHODOLOGY_NOTE =
  "No client results are published in this article. The context described is a typical scenario built to illustrate the method; real values depend on your data, your tools and your teams' adoption.";
const BENEFITS = [
  "A go-live decision based on measurements, not on a demo.",
  "Indicators defined before the project and shared by management and teams.",
  "Every result traceable and verifiable by a third party.",
];

const toMeasure = (label: string) => ({ label, value: "To be measured", subtext: RESULTS_SUBTEXT, isIndicative: true });

export const INSIGHTS_DETAIL_REGISTRY_EN: Record<string, InsightDetailData> = {
  // =========================================================================
  // ARTICLE 01 — RAG IN PRODUCTION
  // =========================================================================
  "evaluer-systeme-rag-production": {
    slug: "evaluer-systeme-rag-production",
    aliases: ["rag-evaluation"],
    readingTime: "6 min",
    publishedDate: REVISED,
    category: { key: "ia", label: "Artificial Intelligence" },
    author: AUTHOR,
    hero: {
      eyebrow: "INSIGHT #01 // ARTIFICIAL INTELLIGENCE & RAG",
      title: "Evaluating a RAG system in production:",
      titleAccent: "metrics, bias and guardrails",
      subtitle:
        "How to move beyond demos and build a reliable continuous evaluation suite with Ragas, TruLens, hybrid search and semantic reranking.",
      tags: ["RAG", "LLM", "Evaluation", "Production", "Qdrant", "Ragas"],
    },
    context: {
      sector: "Insurance & health mutuals",
      sectorBadge: "Insurance & Health",
      useCase: "An assistant helping 450 claims handlers process complex claims",
      constraints:
        "A living corpus of 150,000 scanned policy contracts (80 to 250 pages), exclusion tables and successive amendments",
      stakes:
        "No tolerance for made-up answers on exclusion clauses and reimbursement scales; ACPR and GDPR compliance",
      narrative:
        "In highly regulated sectors such as health insurance, a RAG prototype on five clean PDF documents always impresses the executive committee. Scaling it to 150,000 scanned policy contracts reveals a harsh reality: the rate of correct answers drops sharply, and nobody notices until a customer receives a wrong settlement. Running RAG in production requires a continuous evaluation bench able to measure document faithfulness objectively at every update.",
    },
    problem: {
      heading: "Why traditional metrics and naive chunking fail",
      lead: "In production, RAG pipeline failures almost never come from the language model itself, but from a misalignment between the retrieval step and the generator.",
      failureModes: [
        {
          code: "ERR_01 // NAIVE_CHUNKING",
          title: "Fragmented coverage tables",
          description:
            "Fixed 1,000-token chunking cuts pricing grids and exclusion tables mid-row, stripping the embedding of its contextual header.",
          impact: "Related clauses are no longer retrieved together",
        },
        {
          code: "ERR_02 // ROUGE_BLEU_ILLUSION",
          title: "Surface metrics that miss the point",
          description:
            "BLEU and ROUGE scores measure lexical overlap and completely ignore whether a generated reimbursement figure was invented or faithfully extracted.",
          impact: "False sense of safety in pre-production",
        },
        {
          code: "ERR_03 // SILENT_DRIFT",
          title: "Silent drift when contracts are updated",
          description:
            "Without an automated regression bench, adding a 2025 amendment creates unresolved version conflicts with the 2023 general terms.",
          impact: "Outdated answers in production",
        },
      ],
    },
    approach: {
      heading: "Two-stage pipeline, Ragas triad and deterministic guardrails",
      lead: "I build the architecture around one core principle: never let the generator guess what the retriever has not formally proven.",
      architectureTitle: "The 4 sequential stages of the production pipeline",
      architectureStages: [
        {
          stageNumber: "STAGE 01",
          title: "Semantic ingestion & hierarchical chunking",
          description:
            "Structured OCR extraction preserving the heading tree (H1–H4) and Markdown serialisation of coverage tables.",
          keyPattern: "Hierarchical Chunking + Document Tree",
        },
        {
          stageNumber: "STAGE 02",
          title: "Hybrid dense/sparse search on Qdrant",
          description:
            "Dual vectorisation: BM25 for exact vocabulary (medical procedure codes) and bge-m3 embeddings for conceptual semantic proximity.",
          keyPattern: "Reciprocal Rank Fusion (RRF)",
          badge: "Low latency",
        },
        {
          stageNumber: "STAGE 03",
          title: "Selective cross-encoder reranking",
          description:
            "Fine filtering from 30 initial candidates down to the 5 decisive chunks with Cohere Rerank v3.5 or bge-reranker-large.",
          keyPattern: "Cross-Encoder Reranking",
          badge: "Measured precision",
        },
        {
          stageNumber: "STAGE 04",
          title: "Guardrails & inference with NeMo",
          description:
            "Pre- and post-generation checks: prompt-injection detection and automatic blocking when the document adherence score is below 0.85.",
          keyPattern: "Self-Correction & Fallback Guardrails",
        },
      ],
      techStack: [
        { name: "Ragas", version: "v0.2.14", role: "Computes the triad (Faithfulness, Context Precision, Relevance)", category: "evaluation" },
        { name: "Qdrant", version: "v1.11.0", role: "Vector database with hybrid dense/sparse support", category: "vector" },
        { name: "Cohere Rerank", version: "v3.5", role: "High-precision cross-encoder reranker", category: "model" },
        { name: "NeMo Guardrails", version: "v0.9.1", role: "Guardrails against unsupported answers & security", category: "guardrails" },
        { name: "TruLens", version: "v1.4.0", role: "Continuous monitoring of the triad in production", category: "evaluation" },
      ],
      codeSnippet: {
        title: "ragas_eval_pipeline.py — Faithfulness assertion in CI/CD",
        language: "python",
        code: `# Continuous evaluation in a CI/CD pipeline with Ragas 0.2+
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision
from datasets import Dataset

def assert_rag_quality(test_bench_dataset: Dataset, min_faithfulness: float = 0.90):
    """Blocks the deployment if the factual faithfulness score regresses."""
    results = evaluate(
        test_bench_dataset,
        metrics=[faithfulness, answer_relevancy, context_precision],
    )
    score = results["faithfulness"]
    assert score >= min_faithfulness, (
        f"Critical regression detected: Faithfulness {score:.3f} < threshold {min_faithfulness}"
    )
    return results`,
        caption: "In this scenario, the test runs on a set of reference questions before every merge into the main branch.",
      },
    },
    tradeoffs: {
      heading: "Technical trade-offs, without marketing gloss",
      lead: "Every enterprise architecture decision means giving up a theoretical ideal. These are the deliberate compromises of this implementation.",
      disclaimer:
        "TRANSPARENCY NOTE: I refuse to present RAG as an instant magic solution. Every precision gain is paid for in inference latency or compute cost.",
      tradeoffs: [
        {
          title: "Additional reranking latency",
          tension: "P95 latency vs document faithfulness",
          arbitrage: "Systematically rerank the first 30 candidates with a heavy cross-encoder model.",
          costOrDrawback: "Longer response time because of the reranking step.",
          mitigation: "Parallel fetching and progressive streaming of the assistant's first steps in the user interface.",
        },
        {
          title: "Cost of LLM-as-a-judge evaluation",
          tension: "Evaluation coverage vs API costs",
          arbitrage: "Asynchronous sampling of 5% of production traffic instead of scoring 100% live.",
          costOrDrawback: "Statistical drift is detected over several hours rather than immediately.",
          mitigation: "A fixed set of reference questions run in CI/CD before every release.",
        },
      ],
    },
    results: {
      heading: "Indicators to measure and method",
      lead: RESULTS_LEAD,
      metrics: [toMeasure("Ragas faithfulness"), toMeasure("Residual unsupported-answer rate"), toMeasure("Irrelevant context removed")],
      methodologyNote: METHODOLOGY_NOTE,
      observedBenefits: BENEFITS,
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 01 — Reasoning & RAG",
        description: "High-precision RAG architecture, bge-m3 embeddings, Qdrant and guardrails for enterprise LLMs.",
        badge: "Engineering service",
        href: "/en/services/01",
        targetViewKey: "service-detail",
        targetId: "01",
      },
      {
        type: "solution",
        title: "AVIE — sourced monitoring",
        description: "Every claim in the summary is linked to the extracts that support it.",
        badge: "Ongoing project",
        href: "/en/solutions/avie",
        targetViewKey: "solution-detail",
        targetId: "avie",
      },
      {
        type: "solution",
        title: "Ciblioo — documented M&A sourcing",
        description: "Every displayed value points to its source, its date and the original extract.",
        badge: "Ongoing project",
        href: "/en/solutions/ciblioo",
        targetViewKey: "solution-detail",
        targetId: "ciblioo",
      },
    ],
  },

  // =========================================================================
  // ARTICLE 02 — N8N VS TEMPORAL
  // =========================================================================
  "n8n-vs-temporal-orchestration": {
    slug: "n8n-vs-temporal-orchestration",
    aliases: ["n8n-vs-temporal"],
    readingTime: "8 min",
    publishedDate: REVISED,
    category: { key: "automation", label: "Automation" },
    author: AUTHOR,
    hero: {
      eyebrow: "INSIGHT #02 // DISTRIBUTED ORCHESTRATION & RESILIENCE",
      title: "n8n vs Temporal:",
      titleAccent: "choosing the orchestrator for your critical workflows",
      subtitle:
        "An in-depth comparison between event-driven low-code automation and a distributed orchestration engine with durable execution.",
      tags: ["n8n", "Temporal", "Orchestration", "Workflows", "TypeScript", "Saga"],
    },
    context: {
      sector: "FinTech & B2B payment platforms",
      sectorBadge: "FinTech & Payments",
      useCase: "Orchestrating merchant onboarding: KYC, bank scoring and escrow account provisioning",
      constraints:
        "Long-running asynchronous flows (from a few seconds up to 14 days waiting for identity documents to be validated)",
      stakes: "No state loss and no double debit when infrastructure restarts or a partner bank API times out",
      narrative:
        "In payments and financial services, wiring webhooks to lightweight scripts is attractive at first because it is fast. But when merchant onboarding stretches over 10 days — between automated analysis of a company registration extract, a delayed answer from a trade register and a manual compliance check — state management becomes the critical breaking point. If an automation container restarts while a bank takes 45 seconds to confirm an escrow account, a purely in-memory tool loses track. Choosing between n8n and Temporal is not a tool war: it is a strict engineering boundary between the integration edge and a deterministic transactional engine.",
    },
    problem: {
      heading: "When low-code automation hits the wall of transactional resilience",
      lead: "Low-code orchestrators have transformed the productivity of SaaS integrations, but they reveal 3 major architectural flaws as soon as they drive highly critical business flows.",
      failureModes: [
        {
          code: "FAIL_01 // VOLATILE_STATE",
          title: "State lost when nodes restart",
          description:
            "An n8n execution waiting for an external webhook and held in volatile memory is irreversibly compromised by a Kubernetes rolling update or the OOM killer.",
          impact: "Merchant files stuck with no way to resume",
        },
        {
          code: "FAIL_02 // NO_SAGA_COMPENSATION",
          title: "No distributed transactions (Saga)",
          description:
            "If step 5 of a workflow fails (legal register refusal), undoing steps 2, 3 and 4 (fee debit, temporary account creation) requires hand-written, failure-prone compensation code.",
          impact: "Financial inconsistencies and manual reconciliations",
        },
        {
          code: "FAIL_03 // LOWCODE_MAINTENANCE_DEBT",
          title: "Complex graphs become ungovernable (> 25 nodes)",
          description:
            "Flows with many conditional branches and untyped JavaScript blocks become impossible to unit test or to version cleanly in Git.",
          impact: "Regressions with every connector change",
        },
      ],
    },
    approach: {
      heading: "A pragmatic hybrid architecture: n8n v1.60+ and Temporal v1.25+ working together",
      lead: "Rather than pitting the two paradigms against each other, I separate responsibilities clearly: Temporal at the core of transactions, n8n at the integration edge.",
      architectureTitle: "Architecture split by criticality level",
      architectureStages: [
        {
          stageNumber: "STAGE 01",
          title: "Ingestion edge & n8n webhooks",
          description:
            "n8n (v1.60+) receives heterogeneous external signals (forms, Slack notifications, S3 uploads), validates their syntax and calls the Temporal API.",
          keyPattern: "API Gateway & Payload Sanitization",
          badge: "Low-code",
        },
        {
          stageNumber: "STAGE 02",
          title: "Deterministic durable execution with Temporal",
          description:
            "The Temporal workflow (v1.25+) takes over: a step replayed after a failure never produces its effect twice, and the full event history is kept.",
          keyPattern: "Durable Execution & Event Sourcing",
          badge: "Transactional core",
        },
        {
          stageNumber: "STAGE 03",
          title: "Isolated activities with the Saga pattern",
          description:
            "Every external call (bank API, identity check) is wrapped in an isolated Activity with exponential retries and automatic compensation on rejection.",
          keyPattern: "Saga Pattern Compensation",
        },
        {
          stageNumber: "STAGE 04",
          title: "Long waits on signals & final notification",
          description:
            "The workflow sleeps entirely (no CPU used) until the human validation signal arrives, then notifies the merchant through n8n connectors.",
          keyPattern: "Durable Timers & External Signals",
        },
      ],
      techStack: [
        { name: "Temporal", version: "v1.25.1", role: "Durable execution engine and distributed transaction manager", category: "orchestration" },
        { name: "Temporal TypeScript SDK", version: "v1.11.2", role: "Typed implementation of deterministic workflows and activities", category: "orchestration" },
        { name: "n8n self-hosted", version: "v1.60.0", role: "Fast integration gateway and peripheral SaaS connectors", category: "orchestration" },
        { name: "PostgreSQL", version: "v16.3", role: "ACID persistence of the Temporal cluster and history retention", category: "data" },
      ],
      codeSnippet: {
        title: "merchant_onboarding_workflow.ts — deterministic Saga pattern",
        language: "typescript",
        code: `// Resilient onboarding workflow with automatic compensation (Saga)
import { proxyActivities, defineSignal, setHandler } from "@temporalio/workflow";
import type * as activities from "./activities";

const { verifyKyc, reserveEscrowAccount, cancelEscrowAccount, notifyMerchant } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: "45s",
    retry: { maximumAttempts: 5, backoffCoefficient: 2 },
  });

export async function merchantOnboardingWorkflow(merchantId: string) {
  const compensations: Array<() => Promise<void>> = [];

  try {
    // Step 1: create the escrow account
    const escrow = await reserveEscrowAccount(merchantId);
    compensations.push(() => cancelEscrowAccount(escrow.id));

    // Step 2: strict KYC check
    const kycStatus = await verifyKyc(merchantId);
    if (!kycStatus.approved) {
      throw new Error("KYC_REJECTED");
    }

    await notifyMerchant(merchantId, "ACCOUNT_ACTIVE");
  } catch (err) {
    // Deterministic compensations, in reverse order
    for (const compensate of compensations.reverse()) {
      await compensate();
    }
    throw err;
  }
}`,
        caption: "This workflow is designed to cleanly cancel the accounts it created if KYC is later refused, without losing the state of the journey.",
      },
    },
    tradeoffs: {
      heading: "Engineering trade-offs & operational complexity",
      lead: "Temporal settles state loss and distributed transactions for good, but it demands rigorous engineering discipline.",
      disclaimer:
        "TRADE-OFF NOTE: never deploy a Temporal cluster to send newsletters or sync Notion contacts. Deterministic orchestration is for processes where losing state has a direct cost.",
      tradeoffs: [
        {
          title: "Infrastructure overhead vs no-code simplicity",
          tension: "Maximum resilience vs operational effort",
          arbitrage: "Deploy a full Temporal cluster (PostgreSQL persistence + stateless application workers).",
          costOrDrawback: "Requires solid dev/SRE skills and Prometheus/Grafana metrics monitoring.",
          mitigation: "A managed Temporal cluster for the core business, and a standalone n8n instance for most marketing and internal flows.",
        },
        {
          title: "Strict determinism constraints in code",
          tension: "Freedom of writing vs state reproducibility",
          arbitrage: "No direct network calls, system clock access or non-deterministic generators inside the workflow.",
          costOrDrawback: "Developers need time to learn Temporal's deterministic replay rules.",
          mitigation: "The official Temporal ESLint plugin (`@temporalio/eslint-plugin`) in the CI/CD validation pipeline.",
        },
      ],
    },
    results: {
      heading: "Indicators to measure and method",
      lead: RESULTS_LEAD,
      metrics: [toMeasure("Automatic recovery after failure"), toMeasure("Average SaaS connector integration time"), toMeasure("Financial reconciliation incidents")],
      methodologyNote: METHODOLOGY_NOTE,
      observedBenefits: BENEFITS,
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 02 — Automation & Workflows",
        description: "n8n, Temporal and resilient event-driven systems for critical business flows.",
        badge: "Engineering service",
        href: "/en/services/02",
        targetViewKey: "service-detail",
        targetId: "02",
      },
      {
        type: "service",
        title: "Service 03 — Multi-Agent Systems",
        description: "Orchestration and supervision of collaborative agent fleets with Temporal and the MCP protocol.",
        badge: "Engineering service",
        href: "/en/services/03",
        targetViewKey: "service-detail",
        targetId: "03",
      },
      {
        type: "solution",
        title: "ContentOps Harness",
        description: "“At most once” publishing and duplicate-free recovery after a failure.",
        badge: "Ongoing project",
        href: "/en/solutions/contentops",
        targetViewKey: "solution-detail",
        targetId: "contentops",
      },
    ],
  },

  // =========================================================================
  // ARTICLE 03 — DBT SEMANTIC LAYER & BI
  // =========================================================================
  "couche-semantique-dbt-bi": {
    slug: "couche-semantique-dbt-bi",
    aliases: ["semantic-layer-dbt"],
    readingTime: "5 min",
    publishedDate: REVISED,
    category: { key: "data", label: "Data & Decision" },
    author: AUTHOR,
    hero: {
      eyebrow: "INSIGHT #03 // DATA WAREHOUSE & BUSINESS SEMANTICS",
      title: "The dbt semantic layer:",
      titleAccent: "the missing link for reliable BI",
      subtitle:
        "Why unifying your calculation rules in dbt Core with MetricFlow is essential before feeding dashboards and Text-to-SQL assistants.",
      tags: ["dbt", "Snowflake", "BI", "Semantic Layer", "MetricFlow", "Power BI"],
    },
    context: {
      sector: "Multi-subsidiary omnichannel e-commerce & retail",
      sectorBadge: "Retail & E-commerce",
      useCase: "Consolidated net revenue, gross margin and customer lifetime value across 12 subsidiaries",
      constraints:
        "3 competing reporting tools (Power BI for finance, Metabase for the field, manual SQL queries for analysts)",
      stakes: "Ending meetings where people argue about the figure instead of the sales strategy",
      narrative:
        "In many fast-growing companies, the monthly executive meeting opens with the same pointless ritual: finance announces €14.2M in revenue, marketing claims €15.1M, and subsidiary managers count €13.8M. Nobody is wrong: each team simply calculated its figure in its own tool with its own filters (order date vs invoice date, late exclusion of returns, inconsistent handling of promotional discounts). Trying to fix this chaos with more dashboards only makes the dispersion worse. Only a central semantic layer, declared upstream in the data warehouse, reconciles the figures for good.",
    },
    problem: {
      heading: "Business logic scattered across visualisation tools",
      lead: "Letting every dashboard or BI tool code its own aggregations creates exponential analytical debt and defeats any attempt at natural-language querying.",
      failureModes: [
        {
          code: "ERR_01 // DAX_SQL_DISCORD",
          title: "Structural mismatch between local calculations",
          description:
            "A complex DAX formula in Power BI excludes credit notes with a 15-day lag, while the Metabase SQL query deducts them in real time.",
          impact: "Recurring gaps between departments",
        },
        {
          code: "ERR_02 // TEXT_TO_SQL_CHAOS",
          title: "Text-to-SQL agents unusable without an ontology",
          description:
            "An LLM connected directly to raw database tables makes up the definition of “gross margin” and picks at random between list price and net price.",
          impact: "Frequent errors on questions asked to the AI",
        },
        {
          code: "ERR_03 // SILENT_MAINTENANCE_COST",
          title: "Rule maintenance costs multiply",
          description:
            "Every accounting or tax change means manually editing dozens of separate reports in different tools, with a critical risk of missing one.",
          impact: "Engineering time wasted with every change",
        },
      ],
    },
    approach: {
      heading: "Medallion modelling, dbt Core 1.8+ and universal MetricFlow",
      lead: "I bring all business logic together in the Git-versioned dbt repository: visualisation tools no longer calculate anything, they consume validated indicators.",
      architectureTitle: "From raw data to unified consumption",
      architectureStages: [
        {
          stageNumber: "STAGE 01",
          title: "Medallion normalisation (Bronze / Silver)",
          description:
            "Ingestion and cleaning of raw ERP/Shopify transactions in Snowflake with strict typing and automatic deduplication.",
          keyPattern: "Medallion Architecture & Idempotent ELT",
        },
        {
          stageNumber: "STAGE 02",
          title: "Gold dimensional modelling (star schema)",
          description:
            "Audited transactional fact tables and conformed dimensions (Customers, Products, Stores, Calendar).",
          keyPattern: "Kimball Dimensional Modeling",
          badge: "dbt Core 1.8+",
        },
        {
          stageNumber: "STAGE 03",
          title: "MetricFlow semantic declarations",
          description:
            "Declarative definition of measures and derived metrics in versioned YAML files: additive and non-additive aggregations and rolling windows.",
          keyPattern: "Semantic Metrics Layer (MetricFlow)",
        },
        {
          stageNumber: "STAGE 04",
          title: "Universal exposure (BI & Text-to-SQL)",
          description:
            "Delivery through the Semantic Layer API (GraphQL / JDBC) to Power BI, Metabase and conversational agents without local rewrites.",
          keyPattern: "Universal Semantic Consumption",
          badge: "GraphQL / JDBC API",
        },
      ],
      techStack: [
        { name: "dbt Core", version: "v1.8.4", role: "Transformation engine, data lineage and integrity tests", category: "data" },
        { name: "MetricFlow", version: "v0.20.1", role: "Semantic abstraction engine and dynamic SQL generation", category: "data" },
        { name: "Snowflake", version: "Enterprise", role: "High-performance data warehouse and analytical compute", category: "data" },
        { name: "Power BI", version: "DirectQuery Semantic", role: "Reporting connected to the validated semantic API", category: "data" },
      ],
      codeSnippet: {
        title: "metricflow_semantic_model.yml — defining the Net Revenue metric",
        language: "yaml",
        code: `# Single semantic definition of net revenue
semantic_models:
  - name: transactions
    model: ref('fct_transactions_gold')
    entities:
      - name: transaction_id
        type: primary
      - name: customer_id
        type: foreign
    measures:
      - name: gross_amount
        agg: sum
      - name: refund_amount
        agg: sum
      - name: tax_amount
        agg: sum

metrics:
  - name: net_revenue
    description: "Consolidated net revenue after refunds and taxes"
    type: derived
    type_params:
      expr: gross_amount - refund_amount - tax_amount
      metrics:
        - name: gross_amount
        - name: refund_amount
        - name: tax_amount`,
        caption: "This metric is calculated identically whether the query comes from Power BI, Excel or an AI agent.",
      },
    },
    tradeoffs: {
      heading: "Technical trade-offs & controlled rigidity",
      lead: "A central semantic layer ends disagreements about figures, but it means giving up analysts' opportunistic tinkering.",
      disclaimer:
        "GOVERNANCE NOTE: a semantic layer does not speed up a five-minute ad-hoc chart. It ensures strategic decisions rest on figures defined and checked once.",
      tradeoffs: [
        {
          title: "Formal governance vs local delivery speed",
          tension: "Verified accuracy vs field responsiveness",
          arbitrage: "Every new metric goes through a dbt Git pull request with integrity tests before it appears in dashboards.",
          costOrDrawback: "Creating a new indicator is slower, because it goes through an engineering review.",
          mitigation: "Temporary sandbox schemas for analysts' experiments, isolated from official reporting.",
        },
        {
          title: "Compute overhead on dynamically generated queries",
          tension: "Semantic abstraction vs low-level SQL optimisation",
          arbitrage: "MetricFlow builds SQL queries with nested subqueries to enforce semantic consistency.",
          costOrDrawback: "Slightly higher Snowflake credit consumption without fine partitioning.",
          mitigation: "Incremental dbt materialisation on time dimensions and careful clustering keys in Snowflake.",
        },
      ],
    },
    results: {
      heading: "Indicators to measure and method",
      lead: RESULTS_LEAD,
      metrics: [toMeasure("Calculation gaps between departments"), toMeasure("Accuracy of AI Text-to-SQL queries"), toMeasure("Audit time at monthly close")],
      methodologyNote: METHODOLOGY_NOTE,
      observedBenefits: BENEFITS,
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 04 — Data & Augmented Decision",
        description: "Modern data stack, Medallion modelling, decision BI and natural-language querying.",
        badge: "Engineering service",
        href: "/en/services/04",
        targetViewKey: "service-detail",
        targetId: "04",
      },
      {
        type: "solution",
        title: "Sales steering (idea)",
        description: "An idea to build: sales, margins and stock together, with indicators defined once.",
        badge: "Idea to build",
        href: "/en/solutions/retail-bi",
        targetViewKey: "solution-detail",
        targetId: "retail-bi",
      },
      {
        type: "solution",
        title: "Demand forecasting (idea)",
        description: "An idea to build: order proposals the buyer approves.",
        badge: "Idea to build",
        href: "/en/solutions/logistics-ai",
        targetViewKey: "solution-detail",
        targetId: "logistics-ai",
      },
    ],
  },

  // =========================================================================
  // ARTICLE 04 — INDUSTRIALISING AI AGENTS
  // =========================================================================
  "agents-production-2025": {
    slug: "agents-production-2025",
    aliases: ["agents-ia-production"],
    readingTime: "11 min",
    publishedDate: REVISED,
    category: { key: "ia", label: "Artificial Intelligence" },
    author: AUTHOR,
    hero: {
      eyebrow: "INSIGHT #04 // AGENTIC SYSTEMS & PRODUCTION",
      title: "Industrialising AI agents:",
      titleAccent: "from prototype to production agentic system",
      subtitle:
        "Why so many agent prototypes fail to scale, and the 5 architecture pillars that separate a laptop demo from a reliable enterprise system.",
      tags: ["Agents", "LangGraph", "Production", "MCP", "Langfuse", "FSM"],
    },
    context: {
      sector: "B2B SaaS & L2/L3 technical support operations",
      sectorBadge: "SaaS & Technical Support",
      useCase: "An agent investigating customer incidents: log diagnosis, sandbox tests and pre-qualification of fixes",
      constraints:
        "Heterogeneous runtime environments (REST APIs, Datadog cluster, PostgreSQL database) with tool response times from 200 ms to 15 s",
      stakes: "Eliminating unsupervised destructive actions on customer systems and keeping cumulative inference cost under control",
      narrative:
        "In 2024, the web was flooded with impressive demos of AI agents booking restaurant tables or coding mini-games in three prompts. In enterprise engineering departments, disillusion came fast: many agent prototypes collapse as soon as they face real production operations. Between models that lose their goal after six steps, infinite loops that burn API credits in minutes, and tools called with badly typed arguments, an unbounded agent is a major source of instability. Scaling requires abandoning the illusion of full autonomy and designing strict, tooled and monitored state graphs.",
    },
    problem: {
      heading: "The 4 root causes of fatal agent failures in production",
      lead: "Production failures are not caused by a lack of raw model intelligence, but by the absence of a software structure bounding its room for action.",
      failureModes: [
        {
          code: "ERR_01 // DRIFT_AMNESIA",
          title: "Trajectory amnesia on long contexts",
          description:
            "Beyond 6 consecutive tool interactions, the LLM's attention scatters and the agent forgets the user's initial constraint.",
          impact: "Goal drift and off-topic answers",
        },
        {
          code: "ERR_02 // CONTEXT_SATURATION",
          title: "Context saturated by raw tool outputs",
          description:
            "Injecting an 8,000-line log dump into the prompt pollutes the attention window and sharply increases the cost of every subsequent step.",
          impact: "Soaring API costs and degraded reasoning",
        },
        {
          code: "ERR_03 // INFINITE_LOOP",
          title: "Repetition loops on a failing tool",
          description:
            "Faced with a 404 or 401 from an API, an agent in a free ReAct loop retries the same command indefinitely while tweaking pointless parameters.",
          impact: "Uncontrolled quota consumption within minutes",
        },
      ],
    },
    approach: {
      heading: "Deterministic LangGraph v0.2+ StateGraph, MCP protocol and Langfuse observability",
      lead: "I replace unbounded autonomy with a finite state machine where every transition is validated by deterministic code.",
      architectureTitle: "A secure 4-stage execution architecture",
      architectureStages: [
        {
          stageNumber: "STAGE 01",
          title: "Typed planning & intent validation",
          description: "The problem is broken down into a sequential action plan validated by a strict Pydantic schema before any tool call.",
          keyPattern: "Constrained Intent Planning",
          badge: "Pydantic / Zod",
        },
        {
          stageNumber: "STAGE 02",
          title: "Tool execution through the MCP protocol",
          description:
            "Tool interfaces standardised with the Model Context Protocol (MCP): typed input/output validation and execution in an isolated sandbox.",
          keyPattern: "Model Context Protocol (MCP)",
        },
        {
          stageNumber: "STAGE 03",
          title: "Real-time supervision with Langfuse",
          description:
            "Full tracing of every step (Thought, Action, Observation), recursion-loop detection and per-session cost monitoring.",
          keyPattern: "Full-Trace Observability",
          badge: "Langfuse v2.45+",
        },
        {
          stageNumber: "STAGE 04",
          title: "Deterministic human-in-the-loop guardrails",
          description:
            "The graph state is suspended at a mandatory interruption point whenever an action crosses a criticality threshold (database write, external action).",
          keyPattern: "Stateful Human-in-the-Loop",
        },
      ],
      techStack: [
        { name: "LangGraph", version: "v0.2.16", role: "Orchestrator of deterministic cyclic state graphs", category: "orchestration" },
        { name: "Model Context Protocol", version: "v1.0.0", role: "Standardised and isolated tool calls", category: "infra" },
        { name: "Langfuse", version: "v2.45.1", role: "Full observability, session tracing and budget control", category: "evaluation" },
        { name: "Redis", version: "v7.2.4", role: "State checkpoint persistence and short-term memory", category: "data" },
      ],
      codeSnippet: {
        title: "incident_triage_graph.py — LangGraph state graph with a guardrail",
        language: "python",
        code: `# Agent graph with a human-in-the-loop suspension point
from langgraph.graph import StateGraph, END
from typing import TypedDict, List

class AgentState(TypedDict):
    ticket_id: str
    plan: List[str]
    current_step: int
    findings: List[dict]
    is_destructive_action: bool

def should_require_human_approval(state: AgentState):
    if state.get("is_destructive_action", False):
        return "human_approval_node"
    if state.get("current_step", 0) >= 10:
        return "circuit_breaker_cutoff"
    return "execute_tool_node"

graph = StateGraph(AgentState)
graph.add_node("plan_node", plan_investigation)
graph.add_node("execute_tool_node", run_mcp_tool)
graph.add_node("human_approval_node", suspend_for_approval)
graph.add_node("circuit_breaker_cutoff", emergency_abort)

graph.add_conditional_edges("plan_node", should_require_human_approval)
app = graph.compile(interrupt_before=["human_approval_node"])`,
        caption: "This graph is designed so that no destructive action can run without prior human approval.",
      },
    },
    tradeoffs: {
      heading: "Engineering trade-offs: reliability vs flexibility",
      lead: "Turning an experimental agent into a robust infrastructure component means making clear trade-offs about its autonomy.",
      disclaimer:
        "DESIGN NOTE: I fully accept reducing agents' unpredictability. In a professional setting, a predictable system is always better than disorderly creativity.",
      tradeoffs: [
        {
          title: "Graph determinism vs emergent autonomy",
          tension: "Predictable reliability vs general versatility",
          arbitrage: "Restrict the agent to explicit state paths and cap the number of transitions at 10.",
          costOrDrawback: "The agent cannot solve completely new cases outside its designed graph.",
          mitigation: "Automatic, graceful escalation to a human engineer as soon as the graph reaches a dead end.",
        },
        {
          title: "Cumulative latency of investigation cycles",
          tension: "Depth of reasoning vs user response time",
          arbitrage: "Allow the agent up to 4 reasoning inferences and 3 tool calls.",
          costOrDrawback: "Total processing time of 6 to 18 seconds (indicative) per investigation session.",
          mitigation: "Streaming the reasoning steps in the interface and asynchronous execution through webhooks.",
        },
      ],
    },
    results: {
      heading: "Indicators to measure and method",
      lead: RESULTS_LEAD,
      metrics: [toMeasure("Pre-diagnosis resolved without escalation"), toMeasure("Infinite-loop rate"), toMeasure("Tokens saved per session")],
      methodologyNote: METHODOLOGY_NOTE,
      observedBenefits: BENEFITS,
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 03 — Multi-Agent Systems",
        description: "Collaborative fleets, Langfuse supervision and business tool integration through the MCP protocol.",
        badge: "Engineering service",
        href: "/en/services/03",
        targetViewKey: "service-detail",
        targetId: "03",
      },
      {
        type: "service",
        title: "Service 01 — Reasoning & RAG",
        description: "High-precision vector indexing to feed agents with your document corpus.",
        badge: "Engineering service",
        href: "/en/services/01",
        targetViewKey: "service-detail",
        targetId: "01",
      },
      {
        type: "solution",
        title: "ContentOps Harness",
        description: "Agents that write, and mandatory human approval before anything is published.",
        badge: "Ongoing project",
        href: "/en/solutions/contentops",
        targetViewKey: "solution-detail",
        targetId: "contentops",
      },
    ],
  },

  // =========================================================================
  // ARTICLE 05 — EVENT-DRIVEN ARCHITECTURE FOR MULTI-AGENT SYSTEMS
  // =========================================================================
  "event-driven-agents": {
    slug: "event-driven-agents",
    aliases: ["architecture-multi-agents-evenementielle"],
    readingTime: "12 min",
    publishedDate: REVISED,
    category: { key: "architecture", label: "Architecture" },
    author: AUTHOR,
    hero: {
      eyebrow: "INSIGHT #05 // MULTI-AGENT & EVENT STREAMING",
      title: "Event-driven architecture",
      titleAccent: "for multi-agent systems",
      subtitle:
        "Autonomous agents should not talk to each other through blocking synchronous calls. The Kafka event pattern that makes agent fleets resilient and observable.",
      tags: ["Event-driven", "Kafka", "Multi-Agent", "CloudEvents", "OpenTelemetry"],
    },
    context: {
      sector: "Industry 4.0 & port logistics",
      sectorBadge: "Industry & Logistics",
      useCase: "Coordinating a fleet of 20 agents handling container unloading, rail routing and crane maintenance",
      constraints:
        "Unstable network connectivity on outdoor terminals and heterogeneous compute times (from 50 ms for a sensor to 35 s for a mathematical allocation solver)",
      stakes: "Resilience: a slowdown of the weather agent must not block the ship-handling chain",
      narrative:
        "In academic literature on multi-agent systems, architectures are almost always drawn as direct calls: Agent A queries Agent B, which asks Agent C. Applied to a real industrial environment, this synchronous communication model (blocking HTTP REST or gRPC) is an operational dead end. As soon as a heavy optimisation agent takes 30 seconds to compute a berth plan, network sockets stay open, timeouts propagate upstream and paralyse the whole fleet. The only approach that works at scale is to decouple agents in time through a persistent event bus, where entities publish immutable facts and react asynchronously.",
    },
    problem: {
      heading: "The fatal illusion of synchronous coupling between autonomous agents",
      lead: "Coupling agents through synchronous requests introduces three systemic weaknesses incompatible with industrial high availability.",
      failureModes: [
        {
          code: "FAIL_01 // CASCADING_TIMEOUT",
          title: "Cascading collapse as latency piles up",
          description: "If a routing agent at the end of the chain is temporarily overloaded, every upstream agent times out in turn.",
          impact: "Operational coordination fully blocked",
        },
        {
          code: "FAIL_02 // TRANSIENT_LOSS",
          title: "Messages lost during micro-outages",
          description:
            "If an agent on a mobile crane crosses a network dead zone while a REST command is sent to it, the instruction is lost for good.",
          impact: "Safety orders not received and physical desynchronisation",
        },
        {
          code: "FAIL_03 // OPAQUE_DECISION",
          title: "No way to rebuild the collective decision tree",
          description:
            "In a mesh of cross HTTP calls with no persistent log, understanding why three agents allocated the same berth to two ships is impossible.",
          impact: "No auditability during operational incidents",
        },
      ],
    },
    approach: {
      heading: "Distributed event streaming with Apache Kafka & the CloudEvents 1.0 standard",
      lead: "I turn every agent into an autonomous event processor, decoupled from its peers and responsible for its own local resilience.",
      architectureTitle: "The asynchronous event-driven communication cycle",
      architectureStages: [
        {
          stageNumber: "STAGE 01",
          title: "Publishing immutable business facts",
          description:
            "An agent does not give orders: it publishes a verified fact (“Container #4821 scanned”) wrapped in a standard CloudEvents 1.0 envelope.",
          keyPattern: "Event Sourcing & CloudEvents 1.0",
          badge: "Apache Kafka",
        },
        {
          stageNumber: "STAGE 02",
          title: "Partitioning by business file key",
          description:
            "Kafka routing with a strict partition key (e.g. `vessel_id` or `container_id`) that guarantees strict chronological order.",
          keyPattern: "Strict Partition Ordering",
        },
        {
          stageNumber: "STAGE 03",
          title: "Transactional outbox & local idempotence",
          description:
            "Every local state update of the agent is written atomically with the event to emit in PostgreSQL, preventing any duplicate message.",
          keyPattern: "Transactional Outbox Pattern",
          badge: "No double emission",
        },
        {
          stageNumber: "STAGE 04",
          title: "Causal traceability with OpenTelemetry",
          description:
            "Systematic propagation of `traceparent` and `causation_id` headers across Kafka topics to visualise the fleet's reasoning graph.",
          keyPattern: "Distributed Async Tracing",
        },
      ],
      techStack: [
        { name: "Apache Kafka / Redpanda", version: "v24.1.2", role: "High-performance event streaming bus and immutable log", category: "infra" },
        { name: "CloudEvents", version: "v1.0.2", role: "Standard metadata and routing envelopes", category: "infra" },
        { name: "OpenTelemetry", version: "v1.28.0", role: "Distributed tracing of causality chains between agents", category: "evaluation" },
        { name: "PostgreSQL", version: "v16.3", role: "Agent state persistence and transactional outbox table", category: "data" },
      ],
      codeSnippet: {
        title: "agent_cloudevent_schema.json — an agent's CloudEvents 1.0 envelope",
        language: "json",
        code: `{
  "specversion": "1.0",
  "id": "evt-77a8-42f1-b68e",
  "source": "agents://port-logistics/crane-supervisor-04",
  "type": "com.example.logistics.container_routed",
  "datacontenttype": "application/json",
  "time": "2025-07-15T14:22:18.412Z",
  "traceparent": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
  "data": {
    "container_id": "MSCU-884912-3",
    "allocated_zone": "BUFFER_BAY_D2",
    "reasoning_summary": "Priority zone selected to optimise rail departure at H+4",
    "confidence_score": 0.984
  }
}`,
        caption: "Every interaction carries its OpenTelemetry trace ID, so the whole collective reasoning can be rebuilt.",
      },
    },
    tradeoffs: {
      heading: "Engineering trade-offs: eventual consistency vs synchronicity",
      lead: "Event-driven architecture copes far better with failures, but it forces you to design processes around eventual consistency.",
      disclaimer:
        "ENGINEERING NOTE: in an event-driven architecture, two agents never share an instantaneous state to the millisecond. Business flows must tolerate transient states.",
      tradeoffs: [
        {
          title: "Eventual consistency vs distributed locking",
          tension: "Throughput and availability vs immediate real-time consistency",
          arbitrage: "Adopt eventual consistency and handle allocation conflicts through later reconciliation events.",
          costOrDrawback: "Compensation mechanisms are needed when two agents claim the same resource almost simultaneously.",
          mitigation: "Unique Kafka partition keys per physical resource and optimistic concurrency control (OCC).",
        },
        {
          title: "Observability complexity and mandatory instrumentation",
          tension: "Architectural decoupling vs flow readability",
          arbitrage: "Require 100% of agents to inject and propagate OpenTelemetry contexts on every event.",
          costOrDrawback: "More rigorous development effort for every new agent worker added to the ecosystem.",
          mitigation: "A shared agent SDK that automatically injects CloudEvents metadata and OpenTelemetry spans.",
        },
      ],
    },
    results: {
      heading: "Indicators to measure and method",
      lead: RESULTS_LEAD,
      metrics: [toMeasure("Availability during injected failures"), toMeasure("Lost messages or instructions"), toMeasure("Peak throughput absorbed without degradation")],
      methodologyNote: METHODOLOGY_NOTE,
      observedBenefits: BENEFITS,
    },
    relatedResources: [
      {
        type: "service",
        title: "Service 03 — Multi-Agent Systems",
        description: "Hierarchical architecture, event bus and governance of collaborative enterprise agent fleets.",
        badge: "Engineering service",
        href: "/en/services/03",
        targetViewKey: "service-detail",
        targetId: "03",
      },
      {
        type: "service",
        title: "Service 02 — Automation & Workflows",
        description: "Asynchronous pipelines and resilient execution of event-driven flows.",
        badge: "Engineering service",
        href: "/en/services/02",
        targetViewKey: "service-detail",
        targetId: "02",
      },
      {
        type: "solution",
        title: "Ciblioo — documented M&A sourcing",
        description: "Background processing designed to resume without loss after an incident.",
        badge: "Ongoing project",
        href: "/en/solutions/ciblioo",
        targetViewKey: "solution-detail",
        targetId: "ciblioo",
      },
    ],
  },
};
