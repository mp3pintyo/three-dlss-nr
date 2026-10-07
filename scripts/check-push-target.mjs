const target = process.argv[2] ?? '';
const allowed =
  /^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)mp3pintyo\/three-dlss-nr(?:\.git)?\/?$/;
if (!allowed.test(target)) {
  console.error('Push blocked: this project may only push to mp3pintyo/three-dlss-nr.');
  process.exitCode = 1;
}
