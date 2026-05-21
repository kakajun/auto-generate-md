use agmd::cli::{print_help, Args};
use agmd::commands::*;
use agmd::types::Options;
use agmd::write_md::get_md;
use anyhow::Result;
use clap::Parser;
use dialoguer::{theme::ColorfulTheme, Select};
use std::env;
#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();

    let ignore: Vec<String> = args
        .ignore
        .as_ref()
        .map(|s| s.split(',').map(|x| x.trim().to_string()).collect())
        .unwrap_or_default();

    let include: Vec<String> = args
        .include
        .as_ref()
        .map(|s| s.split(',').map(|x| x.trim().to_string()).collect())
        .unwrap_or_default();

    let options = Options {
        ignore,
        include,
        dry_run: args.dry_run,
        silent: args.silent,
    };

    let root_path = env::current_dir()?;

    let option_ref = if args.ignore.is_none() && args.include.is_none() {
        None
    } else {
        Some(&options)
    };

    let (md, mut nodes) = get_md(option_ref, &root_path).await?;

    let items = vec![
        "📅  生成结构树文档",
        "🔑  修改为相对路径",
        "💎  修改为绝对路径",
        "💯  补全文件后缀",
        "🎁  统一命名文件夹为 Kebab-Case",
        "🍰  统一命名文件为 Kebab-Case",
        "🎁  统一命名文件夹为 CamelCase",
        "🦄  统一命名文件为 UpperCamelCase",
        "🔱  记录节点 JSON",
        "🎊  给需要分类的都打上标记",
        "💥  删除标记",
        "💫  分类",
        "🌈  输出结构及代码",
        "🙏  帮助",
    ];

    let selection = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("请使用上下键选择一个操作命令：")
        .items(&items)
        .default(0)
        .interact_opt()?;

    match selection {
        Some(0) => get_md_action(&md, &root_path, options.dry_run).await?,
        Some(1) => change_path_action(&mut nodes, &root_path, options.dry_run).await?,
        Some(2) => change_absolute_path_action(&mut nodes, &root_path, options.dry_run).await?,
        Some(3) => change_suffix_action(&mut nodes, &root_path, options.dry_run).await?,
        Some(4) => rename_keb_fold_action(&mut nodes, options.dry_run).await?,
        Some(5) => rename_file_action(&mut nodes, &root_path, options.dry_run).await?,
        Some(6) => rename_cam_fold_action(&mut nodes, options.dry_run).await?,
        Some(7) => rename_upper_camel_case_action(&mut nodes, &root_path, options.dry_run).await?,
        Some(8) => write_json_nodes_action(&nodes, &root_path, options.dry_run).await?,
        Some(9) => mark_file_action(&mut nodes, &root_path, options.dry_run).await?,
        Some(10) => delete_mark_action(&mut nodes, options.dry_run).await?,
        Some(11) => write_file_action(&mut nodes, &root_path, options.dry_run).await?,
        Some(12) => code_and_prompt_action(&root_path, &md, &nodes, options.dry_run).await?,
        Some(13) => print_help(),
        _ => {
            println!("操作取消！");
            std::process::exit(1);
        }
    }

    Ok(())
}
