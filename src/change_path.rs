use crate::get_file::change_import;
use crate::types::FileNode;
use crate::utils::get_dependencies;
use anyhow::Result;
use std::path::Path;

fn change_path_sync(
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
                if let Some(obj) = change_import(
                    line,
                    full_path,
                    &dependencies,
                    root_path,
                    no_change_path,
                    to_absolute_alias,
                ) {
                    if obj.imp_name != obj.file_path {
                        println!("Updating import in node: {}", node.full_path);
                        updated = true;
                        return line.replace(&obj.file_path, &obj.imp_name);
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
