/**
 * Free-form knowledge for the chat agent only — never rendered on the site.
 *
 * `profile.ts`, `projects.ts` and `skills.ts` cover what a CV says. This file
 * covers what recruiters actually ask and a CV cannot answer: notice period,
 * relocation, how you work, war stories, salary framing.
 *
 * Just write prose. Markdown headings help the model navigate; nothing here is
 * parsed or validated. Add a section whenever you catch yourself answering the
 * same question twice by email.
 *
 * ⚠️ Everything here is said out loud by the assistant to anyone who asks.
 * Do not write anything you would not tell a stranger on a call.
 */

export const extraKnowledge = `
## Availability and logistics

- Based in Israel (UTC+2). Comfortable working remotely with teams in Europe and Israel.
- Available for new opportunities; no notice period to serve as a freelancer.
- Open to full-time employment, contract work, and freelance projects.

## How I like to work

- I own problems end-to-end: understanding the need, designing the solution,
  deploying it, and maintaining it in production. Most of my projects run for
  real users or real clients, not as demos.
- I lean backend and data-flow first, and I write frontend when that is what
  actually delivers the product.
- I use AI-assisted development daily (Claude, Cursor, GitHub Copilot) and treat
  it as a tool to review and reason with, not to generate code blindly.

## Questions recruiters ask most

**Are you a junior?**
I graduated in 2025 and have been freelancing since 2024, shipping production
systems for paying clients. I am early in my career in years, but the work is
production work: deployed services, real users, maintenance included.

**What is the project you are most proud of?**
PoolGuard. It is a real-time computer vision system running fully on-device on
an NVIDIA Jetson Orin Nano — no cloud. It forced me to care about things web
work rarely surfaces: INT8 quantisation, frame budgets at 25 fps, GStreamer
pipelines, and services that must survive a reboot without anyone watching.

**What was technically hard?**
On PoolGuard, keeping detection reliable at 25 fps on constrained hardware while
avoiding false alarms. The fix was not a better model but better state handling:
an auto-arming state machine with tracking continuity, so a person crossing the
frame does not trigger three separate alerts.

**Do you work with teams?**
Yes. SurveyFlow was built with another developer, splitting backend and frontend
responsibilities and integrating through a shared REST API.

## Things I want to learn next

- Deeper MLOps: model versioning, monitoring drift in production.
- Rust for systems-level work.
- Scaling edge deployments beyond a single device.

## Notes for the assistant

- Answer in the language the visitor writes in (English, French or Hebrew).
- Be concise. Recruiters skim; three sentences beat three paragraphs.
- If you do not know something, say so and offer the email address rather than
  inventing details.
- Never invent employers, dates, metrics or technologies that are not listed here.
`;
