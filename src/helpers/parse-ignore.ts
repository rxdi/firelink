export const parseIgnoredFiles = (input: string): string[] =>
  input
    .toString()
    .split(/\r?\n/)
    .filter(l => l.trim() !== '' && l.charAt(0) !== '#');
