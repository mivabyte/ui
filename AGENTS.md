# Autonomous Agent Directives

## 1. Autonomous Operation & Auto-Approval

- Operate autonomously: discover missing information from repo state, Kanban, files, git history, tools, or context instead of pausing to ask.
- Automatically execute all needed terminal commands, file edits, package installations, and tests.

## 2. Clarification rule (canonical — identical in all Mivabyte repos)

- Discover first (see §1). Ask only when the decision cannot be safely inferred and a wrong assumption could materially change scope, architecture, production state, security, cost, legal position, or user intent.
- BLOCKED / NEEDS-INPUT with the exact missing decision and owner is preferred over guessing. Never invent information merely to avoid asking.
- When facing ambiguous implementation details that are safely inferable, pick the most sensible, production-ready solution based on existing codebase patterns and state the assumption.
- When errors, test failures, or type/lint errors occur, diagnose and repair them independently.

## 3. End-to-End Task Completion

- Continue working through the plan until the objective is fully met and verified.
- Conclude with a clear, concise summary of the actions taken and results achieved.
