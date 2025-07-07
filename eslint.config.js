import { FlatConfig } from '@eslint/config-array'

const config = [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly'
      }
    },
    rules: {
      // Error prevention
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn',
      
      // Code style
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      
      // Best practices
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'arrow-spacing': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never']
    }
  },
  {
    files: ['pages/api/**/*.js'],
    languageOptions: {
      globals: {
        // Node.js globals for API routes
        Buffer: 'readonly',
        global: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly'
      }
    },
    rules: {
      // API specific rules
      'no-console': 'off' // Allow console in API routes for logging
    }
  },
  {
    files: ['lib/**/*.js'],
    rules: {
      // Library files can be more strict
      'no-console': 'warn'
    }
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'communication-plan-backend/**',
      'communication-plan-frontend/**',
      '*.config.js'
    ]
  }
]

export default config