#!/usr/bin/env node
// 获取文件的头部注释工具
const fs = require("fs");
const path = require("path");
/**
 * @description: 获取文件的头部注释
 * @param {*} file
 * @return {*}
 */
function getFile(file) {
  var str = fs.readFileSync(file, "utf-8");
  let sarr = str.split(/[\n,]/g);
  // console.log(file);
  let f =
    sarr[0].indexOf("eslint") == -1 &&
    (sarr[0].indexOf("-->") > -1 ||
      sarr[0].indexOf("*/") > -1 ||
      sarr[0].indexOf("//") > -1)
      ? sarr[0]
      : "";
  // console.log(f);
  return f;
}

const filterArr = [
  "img",
  "styles",
  "node_modules",
  ".git",
  ".github",
  "dist",
  ".husky",
  ".vscode",
];

function getFileNodes(nodes = [], dir = path.resolve("./"), level = 0) {
  let files = fs
    .readdirSync(dir)
    .map((item) => {
      const fullPath = path.join(dir, item);
      const isDir = fs.lstatSync(fullPath).isDirectory();
      return {
        name: item,
        isDir: isDir,
        level,
      };
    })
    // 对文件夹和文件进行排序,要不然生成的和编辑器打开的顺序不对应
    .sort((a, b) => {
      if (!a.isDir && b.isDir) return 1;
      if (a.isDir && !b.isDir) return -1;
      if ((a.isDir && b.isDir) || (!a.isDir && !b.isDir)) return 0;
    });
  for (let index = 0; index < files.length; index++) {
    const item = files[index];
    let note = ""; // 文件注释
    let arr = filterArr.findIndex((obj) => obj === item.name);
    if (arr === -1) {
      const fullPath = path.join(dir, item.name);
      const isDir = fs.lstatSync(fullPath).isDirectory();
      if (isDir) {
        // 递归
        getFileNodes((item.children = []), fullPath, level + 1);
      } else {
        const index = fullPath.lastIndexOf(".");
        const lastName = fullPath.substring(index);
        // 这里只获取js和vue,ts文件的注释
        if ([".js", ".vue", ".ts"].includes(lastName)) {
          note = getFile(fullPath);
        }
        item.note = note;
      }
      nodes.push(item);
    }
  }
  // 控制返回时间节点,不让提前返回
  return nodes;
}

/**
 * @description: 递归得到文件名+note
 * @param {*} datas
 * @param {*} keys
 * @return {*}
 */
function getNote(datas, keys) {
  let nodes = keys ? keys : [];
  datas.forEach((obj) => {
    if (obj.children) {
      // 文件夹
      let md = setMd(obj);
      nodes.push(md);
      getNote(obj.children, nodes);
    }
    // 文件
    else {
      let md = setMd(obj);
      nodes.push(md);
    }
  });
  return nodes;
}

/**
 * @description: 一个obj生成一个一行文字
 * @param {*} obj
 * @return {*}
 */
function setMd(obj) {
  let filesString = "";
  // 把文件夹输出,并且level+1
  const blank = "  ".repeat(obj.level); // 重复空白
  if (obj.isDir) {
    filesString += `${blank}+ ${obj.name}\n`;
  } else {
    var index = obj.name.lastIndexOf(".");
    const lastName = obj.name.substring(index);
    // 这里只获取js和vue文件的注释,需要其他这里加入
    if ([".js", ".vue", ".ts"].includes(lastName) || index === -1) {
      filesString += `${blank}  ${obj.name}            ${obj.note}\n`;
    }
  }
  return filesString;
}

/**
 * @description: 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
function wirteJs(data, filePath) {
  let file = path.resolve(__dirname, filePath);
  const pre = "export default";
  // 异步写入数据到文件
  fs.writeFile(file, pre + data, { encoding: "utf8" }, (err) => {});
}

/**
 * @description: 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
function wirteMd(data, filePath) {
  let file = path.resolve(__dirname, filePath);
  const pre = "```js\n";
  const last = "```\n";
  // 异步写入数据到文件
  fs.writeFile(file, pre + data + last, { encoding: "utf8" }, (err) => {});
}

/**
 * @description: 自动生成全流程
 * @param {*}
 * @return {*}
 */
function agmd() {
  console.log(path.resolve("./"), "执行位置");
  const nodes = getFileNodes();
  // console.log(__dirname + "\\readme-file.js", "nodes");
  const note = getNote(nodes); // 得到所有note的数组
  const md = note.join(""); // 数组转字符串
  if (md.length > 0) {
    console.log("Automatic generation completed ! ");
  }
  // 得到md对象
  // wirteJs(JSON.stringify(nodes), __dirname + "\\readme-file.js");
  // 得到md文档
  console.log("生成位置", path.resolve("./") + "\\readme-md.md");
  wirteMd(md, path.resolve("./") + "\\readme-md.md");
}
agmd();
