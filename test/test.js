const program = require("commander");
const path = require("path");
const fs = require("fs");
const glob = require("glob");
const download = require("../lib/download"); //下载配置
const inquirer = require("inquirer"); // 按需引入
const logSymbols = require("log-symbols");
const chalk = require("chalk");
const remove = require("../lib/remove"); // 删除文件js
const generator = require("../lib/generator"); // 模版插入
const CFonts = require("cfonts");

const fileName = path.resolve(process.cwd(), "../hello");

// console.log(process.cwd());
// console.log(__dirname);
// console.log(fileName);
// console.log(path.basename(process.cwd()));
// console.log(program.usage("<project-name>").parse(process.argv));
// console.log(process.argv);
// console.log({name:program});
console.log(fs.statSync(__dirname).isDirectory());

async function say() {
  console.log(1);
  let name = await setTimeout(() => {
    console.log(2);
  }, 3000);
  await console.log(3);
}

async function test2(num){
  let n = undefined
  if(num === 1){
    n = await new Promise((resolve,reject) => {
      setTimeout(() => {
        resolve(1)
      }, 3000);
    })
  }
  console.log(n);
}