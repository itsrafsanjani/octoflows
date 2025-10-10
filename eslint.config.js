import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: false,
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },
  rules: {
    'react-refresh/only-export-components': 'off',
  },
  ignores: ['storage/**/*', '**/*.{yaml,yml,php}', 'resources/js/Components/shadcn/**/*', 'public/**/*'],
})
