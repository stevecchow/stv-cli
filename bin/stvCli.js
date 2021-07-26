#!/usr/bin/env node

// const program = require("commander"); // npm i commander -D

program
  .version("v" + require("../package.json").version)
  .description(require("../package.json").description)
  .usage("<command> [项目名称]")
  .command("init", "创建新项目")
  .parse(process.argv);

// var asar = require("../lib/geAsar");
// var program = require("commander");

// program
//   .version("v" + require("../package.json").version)
//   .description("Manipulate asar archive files");

// program
//   .command("pack <dir> <output>")
//   .alias("p")
//   .description("create asar archive")
//   .action(function (__dirpath, output) {
//     asar.geAsar(__dirpath, output);
//     console.log(output + "文件成功生成");
//   });
// program.parse(process.argv);

// if (program.args.length === 0) {
//   program.help();
// }
