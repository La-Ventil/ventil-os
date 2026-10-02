/** A trailer is metadata, not prose: `Refs: #12`, `Closes #4`, `Co-Authored-By: …`. */
const TRAILER = /^[A-Za-z][A-Za-z-]*:\s/;

/**
 * Challenges a body over `max` lines of prose. A body is for what the diff cannot say:
 * a constraint, a rejected alternative, an upstream fact, the way a defect failed.
 * A commit that becomes an upstream merge request is its own description, hence the
 * explicit escape: `DENSE_BODY=1 git commit …`.
 */
const bodyMaxProseLines = ({ body }, _when, max) => {
  const prose = (body ?? '').split('\n').filter((line) => line.trim() !== '' && !TRAILER.test(line.trim()));
  if (prose.length <= max || process.env.DENSE_BODY) return [true];
  return [
    false,
    `${prose.length} lines of body, over ${max}. Keep only what the diff cannot say; ` +
      'the reasoning and checks run belong in the review, not the history. ' +
      'If density is right here, say so: DENSE_BODY=1 git commit …'
  ];
};

module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [{ rules: { 'body-max-prose-lines': bodyMaxProseLines } }],
  rules: {
    'body-max-prose-lines': [2, 'always', 4]
  }
};
