#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# setup-env.sh — Bootstrap environment files via symlinks
# -----------------------------------------------------------------------------
set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
RESET='\033[0m'

print_status() { echo -e "${GREEN}✔ $1${RESET}"; }
print_error() { echo -e "${RED}✖ $1${RESET}" >&2; }
print_warning() { echo -e "${YELLOW}⚠ $1${RESET}"; }

# ── Guards ────────────────────────────────────────────────────────────────────
if [[ ! -f ".env.example" ]]; then
  print_error ".env.example not found. Are you running this from the project root?"
  exit 1
fi

if [[ -f ".env" ]]; then
  print_error ".env already exists. Remove it first if you want a fresh setup."
  exit 1
fi

# ── Create root .env ──────────────────────────────────────────────────────────
print_status "Creating .env from .env.example..."
cp .env.example .env

# ── Symlink helper ────────────────────────────────────────────────────────────
# Usage: make_symlink <link_path> <target (relative to link)>
make_symlink() {
  local link="$1"
  local target="$2"
  local dir
  dir="$(dirname "$link")"

  if [[ ! -d "$dir" ]]; then
    print_warning "Directory '$dir' does not exist — skipping $link"
    return
  fi

  # Remove a stale symlink; bail on a real file to avoid silent overwrites
  if [[ -L "$link" ]]; then
    rm "$link"
  elif [[ -e "$link" ]]; then
    print_error "'$link' exists and is not a symlink. Remove it manually."
    exit 1
  fi

  ln -s "$target" "$link"
  print_status "Linked $link → $target"
}

# ── Symlinks ──────────────────────────────────────────────────────────────────
print_status "Creating symbolic links..."
make_symlink "apps/api/.env" "../../.env"
make_symlink "apps/frontend/.env" "../../.env"

# ── Done ──────────────────────────────────────────────────────────────────────
echo
print_status "Environment setup complete!"
print_warning "Remember to update .env with your actual configuration values."
