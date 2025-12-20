# MCP Server Configuration Guide 🔌

> **For AI Coding Assistants (Gemini, Claude, Cursor, etc.)**

## What is MCP?

**Model Context Protocol (MCP)** is a standard that lets AI assistants connect to external tools and services. Think of MCP servers as "plugins" that give AI new capabilities.

---

## Chrome DevTools MCP Server

### What It Does
- Control Chrome browser programmatically
- Run Lighthouse/Performance audits
- Capture screenshots and DOM snapshots
- Debug and inspect web pages
- Execute JavaScript in browser context

### Setup Steps

#### Step 1: Find Your MCP Config File

For **Gemini CLI / Antigravity**, the config is at:
```
Windows: C:\Users\<username>\AppData\Roaming\gemini\mcp.json
macOS: ~/.config/gemini/mcp.json
Linux: ~/.config/gemini/mcp.json
```

#### Step 2: Add Chrome DevTools Server

Open your `mcp.json` and add this configuration:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

**Full Example with Multiple Servers:**
```json
{
  "mcpServers": {
    "firebase-mcp-server": {
      "command": "npx",
      "args": ["-y", "firebase-tools@latest", "experimental:mcp"]
    },
    "perplexity-ask": {
      "command": "npx",
      "args": ["-y", "@anthropic/perplexity-mcp@latest"],
      "env": {
        "PERPLEXITY_API_KEY": "your-key-here"
      }
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

#### Step 3: Restart Your AI Assistant

After editing the config, restart Gemini/Antigravity for changes to take effect.

#### Step 4: Verify It Works

Ask your AI assistant:
> "Please check the Largest Contentful Paint (LCP) of https://example.com"

If configured correctly, the assistant will:
1. Launch Chrome via Puppeteer
2. Navigate to the URL
3. Run performance analysis
4. Return the results

---

## Firebase MCP Server (Already Configured ✅)

Your Firebase MCP is already working. Here's what it provides:

### Tools Available
| Tool | Purpose |
|------|---------|
| `firebase_get_environment` | Check current Firebase project |
| `firebase_list_projects` | List all your Firebase projects |
| `firebase_get_security_rules` | Read Firestore/Storage rules |
| `firebase_init` | Initialize Firebase in a project |
| `firebase_create_app` | Create iOS/Android/Web apps |

### Example Usage
Ask: *"Show me my current Firebase project"*

---

## Adding New MCP Servers

### Pattern
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["package-name@latest"],
      "env": {
        "API_KEY": "your-key-if-needed"
      }
    }
  }
}
```

### Popular MCP Servers
| Name | Package | Purpose |
|------|---------|---------|
| **Chrome DevTools** | `chrome-devtools-mcp` | Browser automation & debugging |
| **Firebase** | `firebase-tools experimental:mcp` | Firebase management |
| **Perplexity** | `@anthropic/perplexity-mcp` | Web search with AI |
| **GitHub** | `@modelcontextprotocol/server-github` | GitHub API access |
| **Postgres** | `@modelcontextprotocol/server-postgres` | Database queries |
| **Filesystem** | `@modelcontextprotocol/server-filesystem` | Extended file access |

---

## Troubleshooting

### Server Not Loading
1. Check JSON syntax (missing commas, brackets)
2. Ensure Node.js 18+ is installed
3. Restart the AI assistant after config changes

### "Command not found"
- Run `npm install -g npx` if npx is missing
- Or use full path: `C:\Users\<user>\AppData\Roaming\npm\npx.cmd`

### Chrome DevTools Specific
If Chrome doesn't launch, try running Chrome manually with debugging:
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

---

## Quick Reference

**Config Location (Windows):**
```
C:\Users\<username>\AppData\Roaming\gemini\mcp.json
```

**Chrome DevTools Config:**
```json
"chrome-devtools": {
  "command": "npx",
  "args": ["chrome-devtools-mcp@latest"]
}
```

**Test Command:**
> "Please capture a screenshot of google.com"

---

*Updated: 2025-12-20*
