export default {
  repositoryUrl: 'https://github.com/mp3pintyo/three-dlss-nr.git',
  branches: ['main'],
  tagFormat: 'v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    './scripts/bilingual-release-notes.mjs',
    './scripts/prepare-release.mjs',
    ['@anolilab/semantic-release-pnpm', { pkgRoot: 'packages/three-dlss-nr', npmPublish: false }],
    // Packs the (now version-bumped) package into release-artifacts/ for the
    // GitHub release below. See the comment in prepare-release.mjs for why
    // this isn't done via @anolilab/semantic-release-pnpm's own `tarballDir`.
    ['./scripts/prepare-release.mjs', { artifacts: true }],
    [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false,
        failTitle: false,
        releasedLabels: false,
        assets: ['release-artifacts/*.tgz', 'CHANGELOG.md'],
      },
    ],
  ],
};
