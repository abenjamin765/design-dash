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
CLAUDE_COMMANDS="${HOME}/.claude/commands"
# Slash commands installed for Claude Code (source files live in commands/)
CLAUDE_COMMAND_NAMES=(
  design-dash
  pitch-site
  orca-start
  orca-workshop
  orca-panel
  orca-research-plan
  orca-synthesize
  orca-teach
  wireframe
)

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

# ── Claude Code slash commands ───────────────────────────────────────────────
link_commands() {
  info "Installing slash commands to ${CLAUDE_COMMANDS}"
  ensure_dir "$CLAUDE_COMMANDS"
  local name src link
  for name in "${CLAUDE_COMMAND_NAMES[@]}"; do
    src="${REPO_DIR}/commands/${name}.md"
    link="${CLAUDE_COMMANDS}/${name}.md"
    if [[ ! -f "$src" ]]; then
      log "skip (missing)  ${name}.md"
      continue
    fi
    if [[ "$DO_UNINSTALL" == true ]]; then
      if [[ -L "$link" ]]; then
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
      continue
    fi
    if [[ -L "$link" && "$(readlink "$link")" == "$src" ]]; then
      log "up-to-date  ${name}"
      continue
    fi
    if [[ -L "$link" || -e "$link" ]]; then
      if [[ "$DRY_RUN" == true ]]; then
        dry "rm $link  (replace)"
      else
        rm "$link"
      fi
    fi
    if [[ "$DRY_RUN" == true ]]; then
      dry "ln -s $src $link"
    else
      ln -s "$src" "$link"
      log "linked  ${name} → $src"
    fi
  done
}

# ── Main ─────────────────────────────────────────────────────────────────────
printf '\n╔══════════════════════════════════════════════════════╗\n'
printf   '║  design-dash installer%s\n' "$([ "$DRY_RUN" == true ] && echo " — DRY RUN" || echo "")"
printf   '╚══════════════════════════════════════════════════════╝\n'
printf 'Repo: %s\n' "$REPO_DIR"

if [[ "$DO_UNINSTALL" == true ]]; then
  [[ "$DO_CURSOR" == true ]] && uninstall_from "$CURSOR_TARGET" "Cursor"
  [[ "$DO_CLAUDE" == true ]] && uninstall_from "$CLAUDE_TARGET" "Claude Code"
  [[ "$DO_CLAUDE" == true ]] && link_commands
  printf '\nDone. Links removed.\n'
  exit 0
fi

[[ "$DO_CURSOR" == true ]] && install_to "$CURSOR_TARGET" "Cursor"
[[ "$DO_CLAUDE" == true ]] && install_to "$CLAUDE_TARGET" "Claude Code"
[[ "$DO_CLAUDE" == true ]] && link_commands

printf '\n✓ Installation complete.\n'
printf '  Cursor skills:      %s\n' "$CURSOR_TARGET"
printf '  Claude Code skills: %s\n' "$CLAUDE_TARGET"
printf '  Claude commands:    %s\n' "$CLAUDE_COMMANDS"
printf '\nNext steps:\n'
printf '  1. Restart Cursor / Claude Code so new skill + command links load\n'
printf '  2. Start a dash: /design-dash (or /design-dash --solo)\n'
printf '  3. Optional Node tooling: cd apps/dash-living-plan && npm install\n'
printf '  4. Optional console: cd apps/dash-console && npm install && npm run dev\n'
printf '  5. Artifacts land in dashes/{slug}/; object guides in library/objects/\n'
printf '  6. See README.md, GETTING_STARTED.md, and AGENTS.md\n'
