---
name: 21st-dev
description: >-
  Integration skill for 21st.dev and Magic MCP. Use when asked to "find UI components on 21st.dev", "install 21st dev component", "generate component with magic mcp", or "search 21st component library".
---

# 21st.dev & Magic MCP Skill

This skill allows the agent to search, inspect, and install high-quality React, Tailwind, and Shadcn UI components directly from the [21st.dev](https://21st.dev) component ecosystem via the 21st Magic MCP server.

---

## 1. Capabilities & Workflow

1. **Search Components**: Query the 21st.dev catalog for production-grade UI components (buttons, navbars, hero sections, cards, modals, animated controls, forms).
2. **Retrieve Source Code**: Fetch raw React + Tailwind CSS code for selected components with full TypeScript typing.
3. **Automated Component Installation**: Install components into the project's `@/components/ui` or target components folder along with required dependencies (lucide-react, framer-motion, clsx, tailwind-merge, etc.).

---

## 2. MCP Integration & Usage

The 21st.dev server is configured via MCP (`@21st-dev/magic-mcp`).

### Available MCP Tools:
- `search_components`: Search components on 21st.dev by keyword or description.
- `get_component`: Fetch component implementation details and dependencies.
- `install_component`: Add component directly into the codebase.

### Example Prompts triggering this skill:
- *"Search 21st.dev for an interactive pricing table with Framer Motion animations."*
- *"Find a modern bento grid component on 21st.dev and add it to components/ui."*
- *"Get a clean navbar component from 21st.dev for my landing page."*

---

## 3. Best Practices

- Always match the installed 21st.dev component's styling with the active project's design system and Tailwind config.
- Ensure all peer dependencies (such as `framer-motion`, `lucide-react`, `radix-ui`) are verified and added to `package.json`.
