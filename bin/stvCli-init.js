#!/usr/bin/env node

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

program.usage("<project-name>").parse(process.argv); // 加入这个能获取到项目名称

// 根据输入，获取项目名称
let projectName = program.rawArgs[2];
// console.log(program);
// console.log("projectName >>> ", projectName);
// 初始化下一步
let next = undefined;

if (!projectName) {
  // 如果没有输入名称则执行 helphelp
  // 相当于执行命令的 --help 选项，显示 help 信息，这是 commander 内置的一个命令选项
  program.help();
  return;
}

/**
 * 1. 当前目录名称与 projectName 一致，直接在当前目录下创建工程
 * 2. 当前目录名称与 projectName 不一致，在当前目录下创建名为 projectName 的工程
 * 3. 当前目录下存在名为 projectName 的项目，询问项目已存在，是否覆盖？
 */
async function goProcess() {
  // 遍历当前目录，得到 ["bin", "lib", "lyz", "node_modules", "package-lock.json", "package.json"];
  const list = glob.sync("*");
  // process.cwd() 是当前执行 node 命令时候的文件夹地址，__dirname 是被执行的 js 文件的地址
  let rootName = path.basename(process.cwd());
  if (list.length) {
    if (
      list.some((n) => {
        const fileName = path.resolve(process.cwd(), n);
        const isDir = fs.statSync(fileName).isDirectory();
        // 判断是否是文件夹，并且文件夹是否与 projectName 同名
        return projectName === n && isDir; // 找到创建文件名和当前目录文件存在一致的文件
      })
    ) {
      // console.log(1);
      // 如果文件夹已经存在
      next = await inquirer
        .prompt([
          {
            name: "isRemovePro",
            message: `项目${projectName}已经存在，是否覆盖文件`,
            type: "confirm",
            default: true,
          },
        ])
        .then((answer) => {
          if (answer.isRemovePro) {
            remove(path.resolve(process.cwd(), projectName));
            rootName = projectName;
            return Promise.resolve(projectName);
          } else {
            console.log("🚫 停止创建");
            return Promise.resolve(undefined);
          }
        });
    } else {
      // console.log(2);
      // 当前目录为空
      rootName = projectName;
      next = await Promise.resolve(projectName);
    }
  } else if (rootName === projectName) {
    // console.log(3);
    // 如果文件名和根目录文件名一致
    rootName = ".";
    next = await inquirer
      .prompt([
        {
          name: "buildInCurrent",
          message:
            "当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？",
          type: "confirm",
          default: true,
        },
      ])
      .then((answer) => {
        console.log(answer.buildInCurrent);
        return Promise.resolve(answer.buildInCurrent ? "." : projectName);
      });
  }
  if (next) {
    next = Promise.resolve(next);
    go();
  }
}

function go() {
  // 预留，处理子命令
  next
    .then((projectFolder) => {
      // console.log("projectFolder >>> ", projectFolder);
      if (projectFolder !== ".") {
        fs.mkdirSync(projectFolder);
      } else {
        return;
      }
      // 配置 cli logo 显示样式
      CFonts.say("stv-cli", {
        font: "simple", // define the font face
        align: "left", // define text alignment
        colors: ["#168e06"], // define all colors
        background: "transparent", // define the background color, you can also use `backgroundColor` here as key
        letterSpacing: 1, // define letter spacing
        lineHeight: 1, // define the line height
        space: true, // define if the output text should have empty lines on top and on the bottom
        maxLength: "0", // define how many character can be on one line
      });
      return download(projectFolder).then((target) => {
        console.log("target >>> ", target);
        return {
          projectFolder,
          downloadTemp: target,
        };
      });
    })
    .then((context) => {
      // console.log("context 1 >>> ", context);
      return inquirer
        .prompt([
          {
            name: "projectName",
            message: "项目的名称",
            default: context.projectFolder,
          },
          {
            name: "projectVersion",
            message: "项目的版本号",
            default: "1.0.0",
          },
          {
            name: "projectDescription",
            message: "项目的简介",
            default: `A project named ${context.projectFolder}`,
          },
          {
            name: "useAntd",
            message: "是否使用antd",
            default: "No",
          },
          // {
          //   name: "useTslint",
          //   message: "是否使用tslint",
          //   default: "No",
          // },
        ])
        .then((answers) => {
          let v = answers.useAntd.toUpperCase();
          answers.useAntd = v === "YES" || v === "Y";
          // let useTslint = answers.useTslint.toUpperCase();
          // answers.useTslint = useTslint === "YES" || useTslint === "Y";
          return {
            ...context,
            metadata: {
              ...answers,
            },
          };
        });
    })
    .then((context) => {
      console.log("生成文件");
      // console.log("context 2 >>> ", context);
      //删除临时文件夹，将文件移动到目标目录下
      return generator(context);
    })
    .then((context) => {
      // 成功用绿色显示，给出积极的反馈
      console.log(logSymbols.success, chalk.green("创建成功:)"));
      console.log(
        chalk.green("cd " + context.projectFolder + "\nnpm install\nnpm start")
      );
    })
    .catch((err) => {
      console.error(err);
      // 失败了用红色，增强提示
      console.log(err);
      console.error(logSymbols.error, chalk.red(`创建失败：${err.message}`));
    });
}

goProcess();
