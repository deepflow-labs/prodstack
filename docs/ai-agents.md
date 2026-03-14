# AI Agents & MCPs

prodstack is designed for agentic development. `.mcp.json` ships with
4 pre-configured MCP servers.

## MCP Servers Overview

| MCP    | Purpose                                     | Auth            |
| ------ | ------------------------------------------- | --------------- |
| shadcn | Browse + install components from registries | None            |
| Convex | Introspect schema, query functions          | Convex account  |
| Figma  | Read Figma designs, translate to code       | FIGMA_API_TOKEN |
| Linear | Create/update issues, projects, PRDs, docs  | OAuth first use |

## Claude Code

`.mcp.json` is automatically loaded by Claude Code when you open the project.

Run `/mcp` in a Claude Code session to see connected servers.

**Add Linear with native HTTP transport (recommended for better performance):**

```bash
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
```

Then run `/mcp` and follow the OAuth flow to authenticate.

## Cursor / Windsurf

`.mcp.json` is read automatically. Enable each server in Settings → MCP.

## Codex

```bash
codex mcp add linear --url https://mcp.linear.app/mcp
```

Or add to `~/.codex/config.toml`:

```toml
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]

[mcp_servers.linear]
url = "https://mcp.linear.app/mcp"
```

## OpenCode

See [OPENCODE.md](../OPENCODE.md) for OpenCode-specific setup.

## VS Code / GitHub Copilot

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] },
    "linear": { "command": "npx", "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"] }
  }
}
```

## Figma MCP setup

1. Go to [figma.com/developers](https://www.figma.com/developers) → Personal access tokens
2. Create a token with read access to your files
3. Add to `.env.local`:
   ```
   FIGMA_API_TOKEN=your_token_here
   ```

The Figma MCP picks it up via the `env` field in `.mcp.json`.

## Linear MCP setup

Linear uses OAuth — no API key needed:

1. Run the Claude Code command or open Cursor with the server enabled
2. You'll be prompted to authenticate via browser on first use
3. Auth state is stored at `~/.mcp-auth` and reused

## Superpowers skills

[Superpowers](https://github.com/obra/superpowers) provides reusable AI agent workflows.
Works with Claude Code, OpenCode, and any tool that supports skills.

```bash
git clone https://github.com/obra/superpowers ~/.config/opencode/skills/superpowers
```

Key skills:

- `brainstorming` — explore requirements before implementing
- `test-driven-development` — write tests first
- `systematic-debugging` — structured bug investigation
- `writing-plans` — create detailed implementation plans
