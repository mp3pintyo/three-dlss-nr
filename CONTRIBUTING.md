# Contributing

These rules apply to every contributor, human or AI agent. This is the source of truth for the contribution workflow. `AGENTS.md` and `CLAUDE.md` point here.

## Exclusive fork destination / Kizárólagos fork

All pushes, issues, pull requests, tags and releases MUST target **mp3pintyo/three-dlss-nr**: <https://github.com/mp3pintyo/three-dlss-nr>. Never open a PR against the original repository or publish there. Original source references and attribution may remain linked upstream.

Minden változás kizárólag a saját forkba kerül. Az eredeti repóba tilos pusholni, PR-t nyitni vagy release-t készíteni. Ez a szabály minden emberi és AI közreműködőre érvényes.

Use `origin` for the fork and set the GitHub CLI default with `gh repo set-default mp3pintyo/three-dlss-nr`. On a fresh clone run `pnpm install` to install the Husky push guard. The guard rejects other push URLs; never bypass it. This checkout also sets `remote.pushDefault=origin` and `push.default=current`. Use explicit `--repo mp3pintyo/three-dlss-nr` for GitHub CLI operations, especially PR creation (GitHub otherwise may select a fork's parent).

## Issue → branch → pull request

1. **Start with an issue in the fork.** Describe the problem, motivation, constraints, and testable acceptance criteria. Reuse an existing issue when it covers the work.
2. **Branch from `main`.** Fetch current `origin/main` and name the branch `<type>/<issue>-<short-description>`, such as `feat/42-feature-block-port`. Use a separate worktree for unrelated local changes.
3. **Commit with Conventional Commits.** Reference the issue in the body where useful.
4. **Run the local checks** below before opening a PR.
5. **Open a PR against the fork's `main`.** Use `gh pr create --repo mp3pintyo/three-dlss-nr --base main`. Use a Conventional Commit title, include `Closes #<issue>` in the body, explain the resulting behavior, and report validation.
6. **Merge on green CI.** Use a merge commit; do not squash or rebase merge. Maintainers choose when to merge.

`main` is the only integration branch. The initial repository bootstrap can land directly on `main`; subsequent tracked changes use PRs.

## Commit format

Use `type(optional-scope): description` in the imperative mood. Allowed types: `feat`, `fix`, `perf`, `docs`, `chore`, `refactor`, `test`, `style`, `build`, `ci`, and `revert`.

- `feat:` produces a minor release.
- `fix:` and `perf:` produce a patch release.
- `!` after the type/scope or a `BREAKING CHANGE:` footer produces a major release.
- Other types do not trigger a release on their own.

After `pnpm install`, Husky runs commitlint on commits. CI checks the PR title and commits; Git-generated merge commits are exempt.

## Local checks

Use the Node version in `.nvmrc` and the pnpm version in `package.json`. The reference implementation is a git submodule, so clone with `--recurse-submodules` or run `git submodule update --init` first.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm tsc
pnpm lint
pnpm format:check
pnpm test
pnpm test:gpu
pnpm release:check
pnpm size
```

`pnpm test:gpu` runs the `*.gpu.test.ts` files on headless WebGPU in Node (Google's Dawn, via `vitest-environment-webgpu-node`), using the machine's GPU. Linux without a GPU needs Mesa's software Vulkan driver: `sudo apt-get install -y libegl1 libgles2 libgl1-mesa-dri mesa-vulkan-drivers` and `LIBGL_ALWAYS_SOFTWARE=1`. The pre-commit hook formats and lints staged files and type-checks the workspace. CI runs the checks on Linux, with the GPU tests on lavapipe. Keep the network port in `packages/three-dlss-nr` and the demo in `packages/website`. Treat `reference/OpenDLSS-NR` as read-only: it is pinned upstream code used for parity tests. Never download, extract, or commit NVIDIA model weights; tests use deterministic synthetic weights. Ported files keep a header crediting OpenDLSS-NR by maan.

## Releases

Every new development must ship as a GitHub Release in the fork, with Hungarian and English notes. A push/merge to `main` automatically runs the release workflow, reruns CI, selects the semantic version from Conventional Commits, and publishes the library tarball and changelog to GitHub. Work is complete only after the workflow succeeds and the public release is verified. Documentation/maintenance commits alone do not trigger a new version.

Before merging, add a dated version section in `CHANGELOG.md`, in the form `## X.Y.Z — YYYY-MM-DD`, with substantive bullet points under both `### Magyar` and `### English`. Select the next version from the most recent release and the commit rules above (first release: `1.0.0`). Release tooling refuses to publish if notes for the calculated version are missing. Version numbers in the packaged library are updated during release; Git tags are the source of truth.

For a retry or preview:

```sh
gh workflow run release.yml --repo mp3pintyo/three-dlss-nr --ref main
gh workflow run release.yml --repo mp3pintyo/three-dlss-nr --ref main -f dry_run=true
gh release view vX.Y.Z --repo mp3pintyo/three-dlss-nr
```

The workflow requires `main` and the fork repository identity. It never publishes to npm. Upstream Cloud Run deployment is disabled in the fork. Keep `.local`, runtime downloads, logs, private model links and proprietary weights out of Git and release assets; they are machine-specific runtime data, not project changes.

## Security

Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md). Do not disclose exploit details in a public issue.
