module.exports = {
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用 tab 缩进，而使用空格
  useTabs: false,
  // 行尾有分号
  semi: true,
  // 使用单引号代替双引号
  singleQuote: false,
  // 对象的 key 仅在必要时用引号
  quoteProps: "consistent",
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾使用逗号
  trailingComma: "all",
  // 大括号内的首尾需要空格 { foo: bar }
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: "always",
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: "preserve",
  // 指定HTML对空格的敏感度。所有空格被视为不敏感，皆采用「空格不敏感格式化」，会去除空格。
  htmlWhitespaceSensitivity: "ignore",
  // 换行符。可选"auto"、"lf"、"cr"、"crlf"
  endOfLine: "lf",
  // 用于 Markdown 等代码的格式化，自动语言识别
  embeddedLanguageFormatting: "auto",
};
