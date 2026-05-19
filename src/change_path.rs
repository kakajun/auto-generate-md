use crate::get_file::{change_import, make_suffix};
use crate::types::FileNode;
use crate::utils::{get_dependencies, get_import_name};
use anyhow::Result;
use std::path::Path;

/// 递归循环所有文件，修改 import 路径（同步版本，供测试调用）
pub fn change_path_sync(
    nodes: &mut [FileNode],
    root_path: &Path,
    no_change_path: bool,
    to_absolute_alias: bool,
    dry_run: bool,
) -> Result<()> {
    for ele in nodes.iter_mut() {
        if let Some(children) = ele.children.as_mut() {
            change_path_sync(children, root_path, no_change_path, to_absolute_alias, dry_run)?;
        } else {
            write_to_file_sync(ele, root_path, true, no_change_path, to_absolute_alias, dry_run)?;
        }
    }
    Ok(())
}

/// 递归循环所有文件，修改 import 路径
pub async fn change_path(
    nodes: &mut [FileNode],
    root_path: &Path,
    no_change_path: bool,
    to_absolute_alias: bool,
    dry_run: bool,
) -> Result<()> {
    tokio::task::block_in_place(|| change_path_sync(nodes, root_path, no_change_path, to_absolute_alias, dry_run))
}

/// 写入文件，替换 import 路径
fn write_to_file_sync(
    node: &FileNode,
    root_path: &Path,
    _is_relative: bool,
    no_change_path: bool,
    to_absolute_alias: bool,
    dry_run: bool,
) -> Result<()> {
    let full_path = Path::new(&node.full_path);
    let package_json_path = root_path.join("package.json");
    let dependencies = get_dependencies(&package_json_path);

    let file_str = std::fs::read_to_string(full_path)?;
    let lines: Vec<&str> = file_str.lines().collect();
    let mut updated = false;

    let updated_lines: Vec<String> = lines
        .iter()
        .map(|line| {
            if line.contains("from") {
                // 跳过 // 开头的非法路径（如 UNC 路径）
                if let Some(imp) = get_import_name(line, &dependencies) {
                    if imp.starts_with("//") {
                        return line.to_string();
                    }
                    // 转绝对路径（@ 别名）时，跳过已经是 @ 的路径
                    // 转相对路径时，@ 路径也需要转换
                    if to_absolute_alias && imp.starts_with("@") {
                        return line.to_string();
                    }
                }
                if let Some(obj) = change_import(
                    line,
                    full_path,
                    &dependencies,
                    root_path,
                    no_change_path,
                    to_absolute_alias,
                ) {
                    // 安全检查：如果生成的路径包含 //?/ 或看起来是错误拼接的路径，跳过
                    if obj.imp_name.contains("//?/") || obj.imp_name.contains("///") {
                        println!("Skipping invalid path in node: {}", node.full_path);
                        return line.to_string();
                    }
                    // 尝试替换原始路径
                    if line.contains(&obj.file_path) {
                        println!("Updating import in node: {}", node.full_path);
                        updated = true;
                        return line.replace(&obj.file_path, &obj.imp_name);
                    }
                    // 如果原始路径不匹配，尝试 make_suffix 补全后的路径
                    let full_original_path = make_suffix(&obj.file_path, full_path, root_path);
                    if line.contains(&full_original_path) {
                        println!("Updating import (with suffix) in node: {}", node.full_path);
                        updated = true;
                        return line.replace(&full_original_path, &obj.imp_name);
                    }
                }
            }
            line.to_string()
        })
        .collect();

    if updated {
        let new_content = updated_lines.join("\n");
        if new_content != file_str {
            if dry_run {
                println!("Dry-run: would write file {}", node.full_path);
            } else {
                std::fs::write(full_path, new_content)?;
                println!("Write file successful: {}", node.full_path);
            }
        }
    }

    Ok(())
}

/// 写入 JS 节点文件
pub async fn write_js_nodes(data: &str, file_path: &Path, dry_run: bool) -> Result<()> {
    let content = format!("export default {}", data);
    if dry_run {
        println!("Dry-run: would write file {}", file_path.display());
    } else {
        tokio::fs::write(file_path, content).await?;
        println!("Write file successful: {}", file_path.display());
    }
    Ok(())
}
