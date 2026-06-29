#!/usr/bin/env bash
# design-dash installer
#
# Symlinks every skill in skills/**/<skill>/ (directories containing SKILL.md)
# into your agent skill directories so Cursor and Claude Code can discover them.
#
# Usage:
#   ./install.sh                   Install for both Cursor and Claude Code
#   ./install.sh --cursor          Install for Cursor only
#   ./install.sh --claude          Install for Claude Code only
#   ./install.sh --dry-run         Show what would be linked, make no changes
#   ./install.sh --uninstall       Remove all symlinks created by this script
#   ./install.sh --update          Re-link (safe to run repeatedly; idempotent)
#   ./install.sh --help            Show this help

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURSOR_TARGET="${HOME}/.cursor/skills"
CLAUDE_TARGET="${HOME}/.claude/skills"

# ── Argument parsing ────────────────────────────────────────────────────────
DRY_RUN=false
DO_CURSOR=true
DO_CLAUDE=true
DO_UNINSTALL=false

for arg in "$@"; do
  case "$arg" in
    --dry-run)    DRY_RUN=true ;;
    --cursor)     DO_CLAUDE=false ;;
    --claude)     DO_CURSOR=false ;;
    --uninstall)  DO_UNINSTALL=true ;;
    --update)     ;;  # idempotent by design; fall through
    --help|-h)
      sed -n '/^# Usage:/,/^$/p' "$0" | sed 's/^# //; s/^#//'
      exit 0
      ;;
    *)
      printf 'Unknown argument: %s\n' "$arg" >&2
      exit 1
      ;;
  esac
done

# ── Helpers ─────────────────────────────────────────────────────────────────
log()  { printf '  %s\n' "$*"; }
info() { printf '\n→ %s\n' "$*"; }
dry()  { printf '  [dry-run] %s\n' "$*"; }

ensure_dir() {
  local dir="$1"
  if [[ "$DRY_RUN" == true ]]; then
    dry "mkdir -p $dir"
  else
    mkdir -p "$dir"
  fi
}

link_skill() {
  local src="$1"    # absolute path to skill dir (contains SKILL.md)
  local target_dir="$2"
  local skill_name
  skill_name="$(basename "$src")"
  local link="${target_dir}/${skill_name}"

  if [[ "$DO_UNINSTALL" == true ]]; then
    if [[ -L "$link" ]]; then
      # Only remove symlinks that point back into this repo
      local link_target
      link_target="$(readlink "$link")"
      if [[ "$link_target" == "$src" || "$link_target" == "$REPO_DIR"/* ]]; then
        if [[ "$DRY_RUN" == true ]]; then
          dry "rm $link"
        else
          rm "$link"
          log "removed $link"
        fi
      fi
    fi
    return
  fi

  # Skip if the link already points to the correct source
  if [[ -L "$link" && "$(readlink "$link")" == "$src" ]]; then
    log "up-to-date  $skill_name"
    return
  fi

  # Remove stale link
  if [[ -L "$link" ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      dry "rm $link  (stale)"
    else
      rm "$link"
    fi
  fi

  if [[ "$DRY_RUN" == true ]]; then
    dry "ln -s $src $link"
  else
    ln -s "$src" "$link"
    log "linked  $skill_name → $src"
  fi
}

# ── Collect skill directories ────────────────────────────────────────────────
# A valid skill directory is any directory containing a SKILL.md file.
collect_skills() {
  local base="$1"
  find "$base/skills" -name "SKILL.md" -not -path "*/node_modules/*" \
    | while IFS= read -r skill_md; do
        dirname "$skill_md"
      done \
    | sort
}

# ── Install ──────────────────────────────────────────────────────────────────
install_to() {
  local target="$1"
  local agent="$2"
  info "Installing to ${target} (${agent})"
  ensure_dir "$target"

  while IFS= read -r skill_dir; do
    link_skill "$skill_dir" "$target"
  done < <(collect_skills "$REPO_DIR")
}

# ── Uninstall ────────────────────────────────────────────────────────────────
uninstall_from() {
  local target="$1"
  local agent="$2"
  info "Removing links from ${target} (${agent})"
  if [[ ! -d "$target" ]]; then
    log "directory does not exist — nothing to remove"
    return
  fi
  while IFS= read -r skill_dir; do
    link_skill "$skill_dir" "$target"
  done < <(collect_skills "$REPO_DIR")
}

# ── Main ─────────────────────────────────────────────────────────────────────
printf '\n╔══════════════════════════════════════════════════════╗\n'
printf   '║  design-dash installer%s\n' "$([ "$DRY_RUN" == true ] && echo " — DRY RUN" || echo "")"
printf   '╚══════════════════════════════════════════════════════╝\n'
printf 'Repo: %s\n' "$REPO_DIR"

if [[ "$DO_UNINSTALL" == true ]]; then
  [[ "$DO_CURSOR" == true ]] && uninstall_from "$CURSOR_TARGET" "Cursor"
  [[ "$DO_CLAUDE" == true ]] && uninstall_from "$CLAUDE_TARGET" "Claude Code"
  printf '\nDone. Links removed.\n'
  exit 0
fi

[[ "$DO_CURSOR" == true ]] && install_to "$CURSOR_TARGET" "Cursor"
[[ "$DO_CLAUDE" == true ]] && install_to "$CLAUDE_TARGET" "Claude Code"

printf '\n✓ Installation complete.\n'
printf '  Cursor skills:      %s\n' "$CURSOR_TARGET"
printf '  Claude Code skills: %s\n' "$CLAUDE_TARGET"
printf '\nNext steps:\n'
printf '  1. Start a dash: open Cursor or Claude Code and run /design-dash\n'
printf '  2. Your dash outputs will appear in dashes/{slug}/\n'
printf '  3. Object guides accumulate in library/objects/ across dashes\n'
printf '  4. See README.md and AGENTS.md for full documentation\n'
