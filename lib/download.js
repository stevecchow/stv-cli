const download = require("download-git-repo");
const path = require("path");
const ora = require("ora");
var ProgressBar = require("./progress_bar");

var pb = new ProgressBar("下载进度", 50);
var num = 0,
  total = 200;

function downloading() {
  if (num <= total) {
    // 更新进度条
    pb.render({ completed: num, total: total });

    num++;
    setTimeout(function () {
      downloading();
    }, 500);
  }
}

module.exports = function (target) {
  target = path.join(target || ".", ".download-temp");
  return new Promise(function (resolve, reject) {
    let url = 'stevecchow/react-ts-template#master'
    // let url = 'amazingliyuzhao/cli-template#test'
    // downloading();
    const spinner = ora(`正在下载项目模板，源地址：${url}`);
    spinner.start();

    // clone false 设置成false 具体设置看官网设置
    download(url, target, { clone: false }, function (err) {
      if (err) {
        spinner.fail();
        reject(err);
      } else {
        // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
        spinner.succeed();
        resolve(target);
      }
    });
  });
};
