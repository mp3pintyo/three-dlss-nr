import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// A versioned entry is required: an old entry cannot silently become a new release.
export function generateNotes(_config, { cwd, nextRelease }) {
  const changelog = readFileSync(join(cwd, 'CHANGELOG.md'), 'utf8').replaceAll('\r\n', '\n');
  const heading = `## ${nextRelease.version} —`;
  const entry = changelog.split('\n').findIndex((line) => line.startsWith(heading));
  if (entry < 0) throw new Error(`Add Hungarian and English CHANGELOG.md notes for ${nextRelease.version}.`);
  const lines = changelog.split('\n').slice(entry + 1);
  const end = lines.findIndex((line) => line.startsWith('## '));
  const notes = lines
    .slice(0, end < 0 ? undefined : end)
    .join('\n')
    .trim();
  for (const language of ['Magyar', 'English']) {
    const section = notes.split(`### ${language}\n`)[1]?.split('\n### ')[0]?.trim();
    if (!section || !/^[-*] \S/m.test(section)) {
      throw new Error(`CHANGELOG.md ${nextRelease.version}: missing ${language} release notes.`);
    }
  }
  return notes;
}
