module.exports = {
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'perf', section: 'Performance' },
    { type: 'style', section: 'Styles' },
    { type: 'docs', section: 'Docs' },
    { type: 'refactor', hidden: true },
    { type: 'test', hidden: true },
    { type: 'build', hidden: true },
    { type: 'ci', hidden: true },
    { type: 'revert', hidden: true },
    { type: 'chore', hidden: true }
  ],
  writerOpts: {
    commitPartial: `* {{#if scope}}**{{scope}}:** {{/if}}{{subject}} ({{shortHash}}){{#if body}}
  {{body}}
{{/if}}`
  }
};
