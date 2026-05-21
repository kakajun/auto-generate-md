use clap::Parser;

#[derive(Parser, Debug, Clone)]
#[command(name = "agmd")]
#[command(about = "Automatically generate a directory structure for any file or folder")]
#[command(version)]
pub struct Args {
    /// 忽略文件或文件夹 (以逗号分隔)
    #[arg(short, long, value_name = "STRING")]
    pub ignore: Option<String>,

    /// 包括文件扩展名 (以逗号分隔)
    #[arg(short = 'n', long, value_name = "STRING")]
    pub include: Option<String>,

    /// 预演模式，不对文件系统进行写入
    #[arg(short, long)]
    pub dry_run: bool,

    /// 静默模式，最小化日志输出
    #[arg(short, long)]
    pub silent: bool,
}

/// 帮助文本
pub fn print_help() {
    println!(
        r#"使用说明:
1. 在控制台按上下切换功能并回车进行确认, 执行相对应的操作！
2. 可以在 package.json 的 scripts 下配置如下, 然后运行命令:
   agmd --include <string> --ignore <string> [--dry-run] [--silent]

  选项:
  --include string  / -n string..........  包括文件扩展名 (以逗号分隔)
  --ignore string  / -i string...........  忽略文件或文件夹 (以逗号分隔)
  --dry-run        / -d..................  预演模式, 不对文件系统进行写入
  --silent         / -s..................  静默模式, 最小化日志输出

  默认配置:
  --ignore  img,styles,node_modules,LICENSE,.git,.github,dist,.husky,.vscode,readme-file.js,readme-md.js
  --include .js,.vue,.ts,.tsx

  示例:
  $ agmd --ignore lib,node_modules,dist --include .js,.ts,.vue --dry-run --silent"#
    );
}
