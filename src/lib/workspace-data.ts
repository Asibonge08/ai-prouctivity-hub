export type Task = {
  id: string;
  title: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  due: string;
  estimate: string;
  done: boolean;
};

export const todaysTasks: Task[] = [
  {
    id: "t1",
    title: "Finalise Q4 launch readiness checklist",
    project: "Project Phoenix",
    priority: "High",
    due: "Today, 16:00",
    estimate: "90 min",
    done: false,
  },
  {
    id: "t2",
    title: "Review vendor contract amendments",
    project: "Procurement",
    priority: "High",
    due: "Today, 17:30",
    estimate: "45 min",
    done: false,
  },
  {
    id: "t3",
    title: "Draft weekly status note for stakeholders",
    project: "Project Phoenix",
    priority: "Medium",
    due: "Today, 18:00",
    estimate: "30 min",
    done: true,
  },
  {
    id: "t4",
    title: "Prepare agenda for design sync",
    project: "Design Team",
    priority: "Medium",
    due: "Tomorrow, 09:30",
    estimate: "20 min",
    done: false,
  },
];

export const deadlines = [
  { id: "d1", title: "Client strategy presentation", when: "Today, 16:00", urgent: true },
  { id: "d2", title: "Quarterly review document", when: "Tomorrow, 09:00", urgent: false },
  { id: "d3", title: "Vendor renewal decision", when: "Friday, 12:00", urgent: false },
];

export const recentActivity = [
  {
    id: "a1",
    tool: "Meeting Summarizer",
    detail: "Weekly project sync — 4 action items extracted",
    when: "12:40",
  },
  {
    id: "a2",
    tool: "Email Generator",
    detail: "Timeline extension request to vendor — formal tone",
    when: "10:15",
  },
  {
    id: "a3",
    tool: "Research Assistant",
    detail: "Hybrid meeting practices for distributed teams",
    when: "Yesterday",
  },
];

export const insights = [
  "Two high-priority tasks are scheduled inside the same hour this afternoon. Consider moving one.",
  "Your meeting notes from Monday contain three action items with no owner recorded.",
  "You draft most emails between 09:00 and 10:00 — a good window to batch correspondence.",
];

export const sampleMeetingNotes = `Weekly Project Phoenix sync — Tuesday
Attendees: Julian, Priya, Marcus, Dana

- Priya reported the design system migration is 70% complete. Remaining work is mostly the data table components.
- Marcus flagged that the vendor API sandbox has been unstable for three days. He has raised a ticket, no ETA yet.
- Discussed whether to hold the launch date. Agreed to keep the current date for now and revisit on Friday once the vendor responds.
- Dana will circulate the revised QA plan before Thursday.
- Open question: do we need a second round of accessibility testing before launch? Nobody was sure who owns that decision.
- Marcus asked about budget for an extra contractor. Deferred to the next steering committee.`;

export const sampleEmail = {
  recipient: "Design team leads (Priya, Marcus)",
  purpose: "Follow up on Q3 sprint feedback and confirm next steps",
  keyPoints: `- Thanks for the detailed feedback in Tuesday's review
- We are adopting the revised spacing scale
- Need confirmation on data table components by Friday
- Happy to run a short working session if useful`,
  subject: "",
};

export const sampleTasks = `Finalise Q4 launch readiness checklist — due today 16:00 — high — 90 min
Review vendor contract amendments — due today 17:30 — high — 45 min
Draft weekly stakeholder status note — due today — medium — 30 min
Prepare agenda for design sync — due tomorrow 09:30 — medium — 20 min
Update onboarding documentation — due Friday — low — 2 hours`;

export const sampleResearchQuestions = [
  "What should we consider before moving our team to a four-day work week?",
  "How do distributed teams typically run effective hybrid meetings?",
  "What are the trade-offs of adopting OKRs for a 12-person team?",
];

export const chatSuggestions = [
  "Help me prioritise my tasks for today",
  "Rewrite this message more professionally",
  "Create an agenda for a 30-minute project sync",
  "Help me prepare for a client review meeting",
];

export const DISCLAIMER =
  "AI-generated content may contain errors or omissions. Review important information before relying on or sharing AI-generated results.";
