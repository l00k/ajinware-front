import eslint from '@eslint/js';
import eslintPluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';


export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintPluginVue.configs['flat/strongly-recommended'],
    {
        files: [ '**/*.vue', '**/*.ts', '**/*.tsx' ],
        languageOptions: {
            parserOptions: {
                parser: '@typescript-eslint/parser'
            }
        }
    },
    {
        files: [ '**/*.js', '**/*.jsx' ],
        rules: {
            'vue/multi-word-component-names': [ 'off' ],
        }
    },
    {
        files: [ '**/*.ts', '**/*.tsx', '**/*.vue' ],
        rules: {
            'no-undef': [ 'off' ],
            'no-constant-condition': [ 'off' ],
            'no-async-promise-executor': [ 'off' ],
            '@typescript-eslint/no-unused-vars': [ 'off' ],
            '@typescript-eslint/no-explicit-any': [ 'off' ],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'separate-type-imports',
                }
            ],
            // only use no-duplicates (merge imports)
            'import/no-duplicates': [ 'error' ],
        },
        plugins: {
            import: importPlugin
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },
    {
        files: [ '**/*.vue' ],
        rules: {
            'vue/html-indent': [ 'error', 4 ],
            'vue/singleline-html-element-content-newline': [ 'off' ],
            'vue/multiline-html-element-content-newline': [ 'off' ],
            'vue/max-attributes-per-line': [
                'error',
                {
                    singleline: { max: 10 },
                    multiline: { max: 1 },
                }
            ],
            'vue/multi-word-component-names': [ 'off' ],
        },
    },
];
