import type { IntakeQuestion } from "./types";

/**
 * Smart Intent Discovery — the guided interview.
 *
 * // Future AI route: cheap model
 * // A cheap model would classify the user's raw industry input and generate
 * // 1–2 dynamic follow-up questions tailored to it (e.g. "You typed 'towing' —
 * // are you interested in heavy-duty or consumer towing?"). For v1 the
 * // question set is static and covers the highest-signal dimensions.
 */
export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  {
    id: "direction",
    title: "What are you trying to do with this industry?",
    subtitle: "This is the most important question — it changes everything downstream.",
    options: [
      { id: "start-main", label: "Start the main business myself" },
      { id: "related-idea", label: "Find a business idea related to this industry" },
      { id: "sell-to-industry", label: "Sell products or services to businesses in this industry" },
      { id: "build-software", label: "Build software for this industry" },
      { id: "find-problems", label: "Find customer problems in this industry" },
      { id: "unsure", label: "I'm not sure yet — help me figure it out" },
    ],
  },
  {
    id: "goal",
    title: "What is your main goal?",
    options: [
      { id: "side-income", label: "Make side income" },
      { id: "full-time", label: "Start a full-time business" },
      { id: "scalable", label: "Build something scalable" },
      { id: "low-cost", label: "Find a low-cost startup idea" },
      { id: "local-service", label: "Find a local service business" },
      { id: "online-business", label: "Build an online business" },
      { id: "create-product", label: "Create a product" },
      { id: "build-software", label: "Build software" },
      { id: "buy-improve", label: "Buy or improve an existing business" },
    ],
  },
  {
    id: "budget",
    title: "What is your starting budget?",
    subtitle: "Be honest — ideas that exceed your budget get flagged.",
    options: [
      { id: "0-500", label: "$0–$500" },
      { id: "500-2500", label: "$500–$2,500" },
      { id: "2500-10000", label: "$2,500–$10,000" },
      { id: "10000-50000", label: "$10,000–$50,000" },
      { id: "50000+", label: "$50,000+" },
    ],
  },
  {
    id: "resources",
    title: "What do you have more of?",
    subtitle: "Pick up to 3.",
    multi: true,
    options: [
      { id: "time", label: "Time" },
      { id: "money", label: "Money" },
      { id: "skills", label: "Skills" },
      { id: "equipment", label: "Equipment" },
      { id: "industry-exp", label: "Industry experience" },
      { id: "local-connections", label: "Local connections" },
      { id: "audience", label: "Online audience" },
      { id: "sales", label: "Sales ability" },
      { id: "marketing", label: "Marketing ability" },
      { id: "technical", label: "Technical ability" },
    ],
  },
  {
    id: "handsOn",
    title: "How hands-on do you want to be?",
    options: [
      { id: "physical", label: "I want to physically do the work" },
      { id: "manage", label: "I want to manage workers" },
      { id: "sell-online", label: "I want to sell online" },
      { id: "software", label: "I want to build software" },
      { id: "middleman", label: "I want to be the middleman" },
      { id: "automated", label: "I want something that can become automated later" },
    ],
  },
  {
    id: "experience",
    title: "Do you already have experience in this industry?",
    options: [
      { id: "professional", label: "Yes, professional experience" },
      { id: "some", label: "Some experience" },
      { id: "none", label: "No experience" },
      { id: "know-someone", label: "I know someone in the industry" },
      { id: "interest-only", label: "I only have interest, not experience" },
    ],
  },
  {
    id: "locality",
    title: "Do you want this to be local, online, or both?",
    options: [
      { id: "local", label: "Local only" },
      { id: "online", label: "Online only" },
      { id: "both", label: "Both" },
      { id: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "risk",
    title: "What risk level are you comfortable with?",
    options: [
      { id: "very-low", label: "Very low risk" },
      { id: "medium", label: "Medium risk" },
      { id: "high", label: "High risk if the upside is worth it" },
    ],
  },
];
