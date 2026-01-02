# Scripts

## Git Hooks

### Pre-commit Hook

A pre-commit hook is set up to automatically generate the resume PDF when
resume-related files are being committed. This ensures the PDF is always
up-to-date and included in the same commit, avoiding the need for Puppeteer
in CI/CD.

**Manual Setup (required for local development):**

After cloning the repository, run this command once to set up the git hooks:

```bash
./scripts/setup-git-hooks.sh
```

**Note:** This is a manual step and should only be run in your local
development environment. It is not needed (and will not run) in CI/CD
pipelines.

**What it does:**
- Runs before each `git commit`
- Detects if resume-related files are being committed
- Generates the resume PDF using the dev server
- Automatically adds the PDF to the same commit if it changed
- Skips generation if no resume files are in the commit

**To skip the hook:**
```bash
git commit --no-verify
```

## Resume Generation Scripts

- `generate-resume-local.js` - Generates resume PDF using dev server (for
  local/pre-push use)
- `generate-resume-in-build.js` - Generates resume PDF using built site (for
  CI/CD use, now optional)
