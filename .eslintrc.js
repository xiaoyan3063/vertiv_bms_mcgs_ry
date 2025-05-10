module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended',
        // 'prettier', // 如果使用 prettier，请保留这一行
    ],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        // 禁用组件名称必须是多词形式的规则
        'vue/multi-word-component-names': 'off',
        'no-unused-vars': 'off'
    },
    overrides: [{
        files: ['*.vue'],
        rules: {
            'max-len': 'off', // 可以根据需要禁用某些规则
        },
    }, ],
};