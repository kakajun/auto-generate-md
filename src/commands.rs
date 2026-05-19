use crate::change_path::{change_path, change_path_sync, write_js_nodes};
use crate::get_router::get_router_arrs;
use crate::mark_file::{delete_mark_all, mark_file};
use crate::mark_write_file::write_mark_file;
use crate::rename_path::{rename_camel_case_file_path, rename_file_path, rename_fold_path};
use crate::types::FileNode;
use crate::write_md::{write_code_and_prompt, write_md};
use anyhow::Result;
use std::path::Path;

/// 生成 MD 文档
pub async fn get_md_action(md: &str, root_path: &Path, dry_run: bool) -> Result<()> {
    println!("\x1B[36m{}\x1B[0m", format!("*** location:  {}/readme-md.md", root_path.display()));
    write_md(md, &root_path.join("readme-md.md"), dry_run).await?;
    Ok(())
}

/// 检查当前目录是否为 src 或 pages
fn check_fold() -> Result<()> {
    let current = std::env::current_dir()?;
    let fold_name = current.file_name().and_then(|s| s.to_str()).unwrap_or("");
    if fold_name == "pages" {
        return Ok(());
    }
    if fold_name != "src" {
        eprintln!("changePath需要在src目录下运行命令!");
        std::process::exit(1);
    }
    Ok(())
}

/// 修改为相对路径
pub async fn change_path_action(nodes: &mut [FileNode], root_path: &Path, dry_run: bool) -> Result<()> {
    check_fold()?;
    change_path(nodes, root_path, false, false, dry_run).await?;
    Ok(())
}

/// 修改为绝对路径（@ 别名）
pub async fn change_absolute_path_action(nodes: &mut [FileNode], root_path: &Path, dry_run: bool) -> Result<()> {
    change_path_sync(nodes, root_path, false, false, dry_run)?;
    change_path_sync(nodes, root_path, false, true, dry_run)?;
    Ok(())
}

/// 补全文件后缀
pub async fn change_suffix_action(nodes: &mut [FileNode], root_path: &Path, dry_run: bool) -> Result<()> {
    check_fold()?;
    change_path(nodes, root_path, true, false, dry_run).await?;
    Ok(())
}

/// 打标记
pub async fn mark_file_action(nodes: &mut [FileNode], root_path: &Path, dry_run: bool) -> Result<()> {
    check_fold()?;
    let routers = get_router_arrs(root_path).await?;
    let router_json = serde_json::to_string(&routers)?;
    write_js_nodes(&format!("const router={}", router_json), &root_path.join("router-file.js"), dry_run).await?;
    mark_file(nodes, &routers, root_path, dry_run).await?;
    let nodes_json = serde_json::to_string(nodes)?;
    write_js_nodes(&nodes_json, &root_path.join("readme-file.js"), dry_run).await?;
    Ok(())
}

/// 分类（复制标记文件）
pub async fn write_file_action(nodes: &mut [FileNode], root_path: &Path, dry_run: bool) -> Result<()> {
    let routers = get_router_arrs(root_path).await?;
    mark_file(nodes, &routers, root_path, dry_run).await?;
    write_mark_file(nodes, &routers, root_path, dry_run).await?;
    Ok(())
}

/// 删除标记
pub async fn delete_mark_action(nodes: &mut [FileNode], dry_run: bool) -> Result<()> {
    delete_mark_all(nodes, "mark", dry_run).await?;
    Ok(())
}

/// 统一命名文件夹为 kebab-case
pub async fn rename_keb_fold_action(nodes: &mut [FileNode], dry_run: bool) -> Result<()> {
    rename_fold_path(nodes, false, dry_run).await?;
    Ok(())
}

/// 统一命名文件为 kebab-case
pub async fn rename_file_action(nodes: &mut [FileNode], root_path: &Path, dry_run: bool) -> Result<()> {
    rename_file_path(nodes, root_path, dry_run).await?;
    Ok(())
}

/// 统一命名文件夹为 CamelCase
pub async fn rename_cam_fold_action(nodes: &mut [FileNode], dry_run: bool) -> Result<()> {
    rename_fold_path(nodes, true, dry_run).await?;
    Ok(())
}

/// 统一命名文件为 UpperCamelCase
pub async fn rename_upper_camel_case_action(nodes: &mut [FileNode], root_path: &Path, dry_run: bool) -> Result<()> {
    rename_camel_case_file_path(nodes, root_path, dry_run).await?;
    Ok(())
}

/// 输出结构及代码
pub async fn code_and_prompt_action(root_path: &Path, md: &str, nodes: &[FileNode], dry_run: bool) -> Result<()> {
    write_code_and_prompt(root_path, md, nodes, dry_run).await?;
    Ok(())
}

/// 记录节点 JSON
pub async fn write_json_nodes_action(nodes: &[FileNode], root_path: &Path, dry_run: bool) -> Result<()> {
    let nodes_json = serde_json::to_string(nodes)?;
    write_js_nodes(&nodes_json, &root_path.join("readme-file.js"), dry_run).await?;
    Ok(())
}

/// 执行所有操作
pub async fn generate_all_action(nodes: &mut [FileNode], md: &str, root_path: &Path, dry_run: bool) -> Result<()> {
    check_fold()?;
    let routers = get_router_arrs(root_path).await?;
    get_md_action(md, root_path, dry_run).await?;
    change_path_action(nodes, root_path, dry_run).await?;
    mark_file_action(nodes, root_path, dry_run).await?;
    write_mark_file(nodes, &routers, root_path, dry_run).await?;
    let nodes_json = serde_json::to_string(nodes)?;
    write_js_nodes(&nodes_json, &root_path.join("readme-file.js"), dry_run).await?;
    Ok(())
}
