module.exports = {
	env: { node: true, commonjs: true, es2021: true, jest: true },
	extends: ['airbnb', 'eslint:recommended', 'prettier'],
	overrides: [
		{
			env: { node: true },
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: { sourceType: 'script' },
		},
	],
	parserOptions: { ecmaVersion: 'latest' },
	plugins: ['prettier'],
	rules: { 'prettier/prettier': ['warn'] },
};
