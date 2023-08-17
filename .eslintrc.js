module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // 要求使用 let 或 const 而不是 var
    "no-var": "error",
    // 要求使用 const 声明那些声明后不再被修改的变量
    "prefer-const": "error",
    // 声明但未使用的变量警告
    "no-unused-vars": "warn",
    // 强制switch要有default分支
    "default-case": 2,
    // 强制使用一致的缩进（"SwitchCase"（默认：0) 强制 switch 语句中 case 子句的缩进级别。缩进 2 个空格并将 SwitchCase 设置为 1 将缩进 case 子句，其中 2 个空格相对于 switch 语句。）
    "indent": 0,
    // 强制使用骆驼拼写法命名约定
    "camelcase": 0,
    // 函数表达式必须有名字
    "func-names": 0,
    // 单引号
    "single-quote": 0,
  },
};
