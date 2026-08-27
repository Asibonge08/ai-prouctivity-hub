# AI Workplace Companion

Here’s a stronger Lovable AI prompt you can paste directly. It focuses on the product experience, AI behavior, prompt engineering, and UI without asking Lovable to generate code.

Build a modern, responsive SaaS web application called AI Workplace Productivity Assistant that helps professionals save time and improve productivity by automating common workplace tasks with AI.

Core Goal

Create an intelligent workplace productivity hub where users can generate professional emails, summarize meeting notes, plan tasks, research topics, and interact with an AI workplace assistant from one unified dashboard.

The application should feel polished, professional, intuitive, and production-ready rather than like a basic student project.

Required AI Features

Include all five of the following features:

1. Smart Email Generator

Create an AI-powered email writing tool.

User inputs:

Recipient/context

Purpose of the email

Key points

Optional subject

Tone: Formal, Friendly, or Persuasive

AI output:

Suggested subject line

Professional email body

Clear structure and appropriate language

Include actions for:

Regenerate

Change tone

Edit

Copy

Prompt behavior:
The AI should preserve the user's intended meaning while improving clarity, professionalism, grammar, and structure. It must not invent important facts, dates, commitments, or information that the user did not provide.

2. Meeting Notes Summarizer

Allow users to paste lengthy meeting notes or upload meeting content.

The AI should produce:

Executive summary

Key discussion points

Decisions made

Action items

Responsible person, when explicitly mentioned

Deadlines, when explicitly mentioned

Important follow-ups

Clearly separate facts from assumptions. If an owner or deadline is not present in the notes, display "Not specified" rather than inventing one.

3. AI Task Planner / Scheduler

Allow users to enter tasks, deadlines, priorities, estimated durations, and optional working hours.

The AI should:

Prioritize tasks

Identify urgent and important work

Generate a realistic daily or weekly schedule

Break large tasks into smaller steps

Account for deadlines

Avoid unrealistic scheduling

Include reasonable breaks and buffer time

Display the resulting schedule in a clean timeline or calendar-style interface.

4. AI Research Assistant

Allow users to enter a research question or topic.

The assistant should provide:

Concise summary

Key insights

Important considerations

Pros and cons where relevant

Recommendations

Suggested follow-up questions

When information may be uncertain or incomplete, clearly communicate that limitation. Do not present generated information as verified fact.

Include an editable research output area.

5. AI Chatbot Interface

Create an interactive AI workplace assistant.

Users should be able to ask questions such as:

Help me prioritize my tasks

Rewrite this message professionally

Summarize these notes

Help me prepare for a meeting

Create an agenda

Suggest ways to improve my productivity

The chatbot should maintain conversational context during the current session and provide concise, practical workplace-oriented responses.

Dashboard

Create a professional dashboard homepage containing:

Welcome message

Productivity overview

Quick-action cards for each AI feature

Recent activity

Today's tasks

Upcoming deadlines

AI productivity insights

Use clear visual hierarchy and make the most frequently used actions easy to access.

Navigation

Use a responsive sidebar navigation containing:

Dashboard

Email Generator

Meeting Summarizer

Task Planner

Research Assistant

AI Chat

Settings

On mobile, convert the sidebar into an accessible collapsible navigation menu.

Input and Output Experience

Every AI feature should have a clear two-part workflow:

Input → Generate → Review/Edit → Copy/Use

AI-generated content must be editable before the user uses it.

Use:

Text areas

Dropdowns

Tone selectors

Priority selectors

Date/time inputs

Generate buttons

Regenerate buttons

Copy buttons

Clear/reset controls

Show useful loading states while AI responses are being generated.

Prompt Engineering

Design structured prompts for each AI feature.

Prompts should clearly define:

Role

Objective

User-provided context

Desired output format

Constraints

Accuracy requirements

Responsible AI behavior

The AI should prioritize accuracy, transparency, relevance, and usefulness.

Responsible AI

Include a visible but unobtrusive disclaimer throughout the application:

"AI-generated content may contain errors or omissions. Review important information before relying on or sharing AI-generated results."

For research and meeting summaries, make it clear that the AI should not fabricate sources, facts, decisions, owners, deadlines, or other information.

For workplace communication, remind users to review sensitive or confidential information before submitting it to an AI system.

UI/UX Design

Use a clean, modern SaaS aesthetic.

Design characteristics:

Professional

Minimal

Spacious

Easy to scan

Consistent typography

Clear cards and panels

Subtle borders and shadows

Strong visual hierarchy

Accessible contrast

Consistent buttons and form controls

The interface should feel comparable to a polished modern productivity platform.

Responsive Design

The application must work smoothly on:

Desktop

Laptop

Tablet

Mobile

Ensure forms, cards, navigation, AI outputs, schedules, and chatbot messages adapt properly to smaller screens.

Empty, Loading, and Error States

Design polished states for:

No recent activity

Empty input

AI generation in progress

Generation failure

Invalid input

No scheduled tasks

No research results

Provide helpful guidance rather than leaving blank screens.

Sample Content

Populate the interface with realistic workplace examples so the application looks functional immediately.

Examples:

Project status emails

Team meeting notes

Weekly project tasks

Business research questions

Workplace productivity conversations

Do not use fake statistics or claim that AI-generated information is verified.

Overall Experience

The final product should feel like a complete AI-powered workplace productivity platform, not five unrelated tools.

Maintain consistent navigation, branding, components, terminology, and interaction patterns across all features.

Prioritize:

Functionality

Excellent user experience

High-quality AI prompts

Professional visual design

Responsible AI

Clear presentation of AI-generated information

The application should demonstrate clear innovation by combining multiple workplace AI capabilities into one cohesive productivity assistant.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a69fcc9e-9ab2-4317-a698-a3bf1879c4a3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
