#!/bin/bash

# Pre-commit hook to generate resume PDF if resume files are being committed
# This ensures the resume.pdf is always up-to-date and included in the commit

set -e

# Get list of files being committed
STAGED_FILES=$(git diff --cached --name-only)

# Check if any resume-related files are being committed
RESUME_FILES_IN_COMMIT=$(echo "$STAGED_FILES" | grep -E "(resume|src/pages/resume)" || true)

# If no resume files in this commit, skip
if [ -z "$RESUME_FILES_IN_COMMIT" ]; then
  exit 0
fi

echo "Resume files detected in commit. Generating resume PDF..."

# Generate resume PDF
npm run generate-resume-local

# Check if resume.pdf exists
if [ ! -f "static/resume.pdf" ]; then
  echo "Error: resume.pdf not found after generation"
  exit 1
fi

# Check if resume.pdf is already staged in this commit
if git diff --cached --name-only | grep -q "static/resume.pdf"; then
  echo "✓ Resume PDF already included in commit"
else
  # Check if the PDF file has changes (compared to HEAD)
  if ! git diff --quiet HEAD -- static/resume.pdf 2>/dev/null; then
    echo "Adding updated resume.pdf to commit..."
    git add static/resume.pdf
    echo "✓ Resume PDF added to commit"
  else
    echo "✓ Resume PDF is up-to-date (no changes detected)"
  fi
fi

exit 0
