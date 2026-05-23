export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Max 170 characters for header (subject line)
        'header-max-length': [2, 'always', 170],
        // Max 170 characters per body line
        'body-max-line-length': [2, 'always', 170],
        // Max 170 characters per footer line
        'footer-max-line-length': [2, 'always', 170],
    },
};
