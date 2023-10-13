module.exports = {
    // addition to .eslintignore
    ignorePatterns: ["/cubism", "*.js"],

    env: {
        browser: true,
        es2020: true,
        node: true,
        mocha: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    root: true,
    rules: {
        "@typescript-eslint/consistent-type-imports": ["warn", { disallowTypeAnnotations: false }],

        // "warn" is for better DX in IDEs, and will be changed to "error" when running "npm run lint"
        "prettier/prettier": "warn",

        // IDEs already warn about unused vars
        "@typescript-eslint/no-unused-vars": "off",

        // TODO: enable this later
        "@typescript-eslint/no-explicit-any": "off",
    },
    overrides: [
        {
            files: ["*.js"],
            rules: {
                "@typescript-eslint/no-var-requires": "off",
            },
        },
    ],
};
