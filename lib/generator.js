const Metalsmith = require("metalsmith"); // 插值
const Handlebars = require("handlebars"); // 模版
const remove = require("../lib/remove"); // 删除
const fs = require("fs");
const path = require("path");
/**
 * 生成文件
 * @param context 文件配置参数对象
 */
module.exports = function (context) {
  let metadata = context.metadata; // 用户自定义信息
  let src = context.downloadTemp; // 暂时存放文件目录
  let dest = "./" + context.projectFolder; //项目的根目录
  // console.log("balabala 3 >>> ", context);
  // console.log("src >>> ", src);

  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`));
  }

  return new Promise((resolve, reject) => {
    const metalsmith = Metalsmith(process.cwd())
      .metadata(metadata) // 将用户输入信息放入
      .clean(false)
      .source(src)
      .destination(dest);

    // console.log("metalsmith >>> ", metalsmith);

    metalsmith
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata();
        // console.log("meta >>> ", meta);
        // console.log("files >>> ", files);
        Object.keys(files).forEach((fileName) => {
          // console.log("fileName >>> ", fileName);
          if (!["png",'ico','jsx'].includes(fileName.split(".").pop())) {
            const t = files[fileName].contents.toString();
            // console.log(`${fileName} >>>`, t);
            files[fileName].contents = new Buffer.from(
              Handlebars.compile(t)(meta),
              "UTF-8"
            );
          }
        });
        done();
      })
      .build((err) => {
        remove(src);
        err ? reject(err) : resolve(context);
        // console.log('err >>> ',err);
        // resolve(context);
      });
  });
};
