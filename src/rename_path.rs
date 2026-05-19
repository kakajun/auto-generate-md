use crate::types::{FileNode, RenameInfo};
use crate::utils::{check_camel_file, check_upper_camel_file, to_camel_case, to_kebab_case, get_dependencies, get_import_name};
use anyhow::Result;
use std::path::Path;

fn rename_fold_path_sync(nodes: &mut [FileNode], is_camel_case: bool, dry_run: bool) -> Result<()> {
    for ele in nodes.iter_mut() {
        if ele.is_dir {
            rename_fold_sync(ele, is_camel_case, dry_run)?;
        }
        if let Some(children) = ele.children.as_mut() {
            rename_fold_path_sync(children, is_camel_case, dry_run)?;
        }
    }
    Ok(())
}

/// 递归重命名文件夹
pub async fn rename_fold_path(nodes: &mut [FileNode], is_camel_case: bool, dry_run: bool) -> Result<()> {
    tokio::task::block_in_place(|| rename_fold_path_sync(nodes, is_camel_case, dry_run))
}

fn rename_file_path_sync(nodes: &mut [FileNode], root_path: &Path, dry_run: bool) -> Result<()> {
    for ele in nodes.iter_mut() {
        if let Some(children) = ele.children.as_mut() {
            rename_file_path_sync(children, root_path, dry_run)?;
        } else {
            rename_file_sync(ele, dry_run)?;
            rewrite_file_sync(ele, root_path, false, dry_run)?;
        }
    }
    Ok(())
}

/// 递归重命名文件（kebab-case）
pub async fn rename_file_path(nodes: &mut [FileNode], root_path: &Path, dry_run: bool) -> Result<()> {
    tokio::task::block_in_place(|| rename_file_path_sync(nodes, root_path, dry_run))
}

fn rename_camel_case_file_path_sync(nodes: &mut [FileNode], root_path: &Path, dry_run: bool) -> Result<()> {
    for ele in nodes.iter_mut() {
        if let Some(children) = ele.children.as_mut() {
            rename_camel_case_file_path_sync(children, root_path, dry_run)?;
        } else {
            rename_camel_case_file_sync(ele, dry_run)?;
            rewrite_file_sync(ele, root_path, true, dry_run)?;
        }
    }
    Ok(())
}

/// 递归重命名文件（CamelCase）
pub async fn rename_camel_case_file_path(nodes: &mut [FileNode], root_path: &Path, dry_run: bool) -> Result<()> {
    tokio::task::block_in_place(|| rename_camel_case_file_path_sync(nodes, root_path, dry_run))
}

/// 重写文件中的 import 路径
fn rewrite_file_sync(node: &mut FileNode, root_path: &Path, is_camel_case: bool, dry_run: bool) -> Result<()> {
    let mut write_flag = false;
    let file_content = std::fs::read_to_string(&node.full_path)?;
    let mut lines: Vec<String> = file_content.lines().map(|s| s.to_string()).collect();

    let package_json_path = root_path.join("package.json");
    let dependencies = get_dependencies(&package_json_path);

    for line in lines.iter_mut() {
        if line.contains("from") {
            if let Some(import_module_name) = get_import_name(line, &dependencies) {
                let name = std::path::Path::new(&import_module_name)
                    .file_stem()
                    .and_then(|s| s.to_str())
                    .unwrap_or(&import_module_name);

                if is_camel_case {
                    if check_upper_camel_file(name) {
                        let new_name = to_camel_case(name);
                        let parts: Vec<&str> = line.split("from").collect();
                        if parts.len() == 2 {
                            *line = format!("{}from{}", parts[0], parts[1].replace(name, &new_name));
                            write_flag = true;
                        }
                    }
                } else if check_camel_file(name) {
                    let new_name = to_kebab_case(name);
                    let parts: Vec<&str> = line.split("from").collect();
                    if parts.len() == 2 {
                        *line = format!("{}from{}", parts[0], parts[1].replace(name, &new_name));
                        write_flag = true;
                    }
                }
            }
        }
    }

    if write_flag {
        let updated = lines.join("\n");
        if dry_run {
            println!("Dry-run: would rewrite file {}", node.full_path);
        } else {
            std::fs::write(&node.full_path, updated)?;
            println!("Rewrote file successfully: {}", node.full_path);
        }
    }

    Ok(())
}

/// 重命名单个文件夹
fn rename_fold_sync(node: &mut FileNode, is_camel_case: bool, dry_run: bool) -> Result<()> {
    let filename = std::path::Path::new(&node.full_path)
        .file_name()
        .and_then(|s| s.to_str())
        .unwrap_or(&node.name);

    let should_rename = if is_camel_case {
        check_upper_camel_file(filename)
    } else {
        check_camel_file(filename)
    };

    if should_rename && node.is_dir {
        let info = replace_name_sync(&node.full_path, is_camel_case, dry_run)?;
        change_path_fold(node, &info);
    }
    Ok(())
}

/// 重命名后更新子节点路径
pub fn change_path_fold(node: &mut FileNode, rename_info: &RenameInfo) {
    if let Some(children) = node.children.as_mut() {
        for child in children.iter_mut() {
            change_path_fold(child, rename_info);
        }
    }
    node.full_path = node.full_path.replace(&rename_info.old_name, &rename_info.new_name);
    node.name = node.name.replace(&rename_info.old_name, &rename_info.new_name);
}

/// 重命名文件（kebab-case）
fn rename_file_sync(node: &mut FileNode, dry_run: bool) -> Result<()> {
    let filename = std::path::Path::new(&node.full_path)
        .file_name()
        .and_then(|s| s.to_str())
        .unwrap_or(&node.name);

    if check_camel_file(filename) {
        let suffixes = [".js", ".vue", ".tsx"];
        let last_name = std::path::Path::new(&node.full_path)
            .extension()
            .and_then(|s| s.to_str())
            .unwrap_or("");
        let flag = suffixes.iter().any(|item| *item == format!(".{}", last_name));
        if flag {
            let info = replace_name_sync(&node.full_path, false, dry_run)?;
            change_path_name(node, &info, false);
        }
    }
    Ok(())
}

/// 重命名文件（CamelCase）
fn rename_camel_case_file_sync(node: &mut FileNode, dry_run: bool) -> Result<()> {
    let filename = std::path::Path::new(&node.full_path)
        .file_name()
        .and_then(|s| s.to_str())
        .unwrap_or(&node.name);

    if !check_upper_camel_file(filename) {
        let suffixes = [".vue"];
        let last_name = std::path::Path::new(&node.full_path)
            .extension()
            .and_then(|s| s.to_str())
            .unwrap_or("");
        let flag = suffixes.iter().any(|item| *item == format!(".{}", last_name));
        if flag {
            let info = replace_name_sync(&node.full_path, true, dry_run)?;
            change_path_name(node, &info, true);
        }
    }
    Ok(())
}

/// 更新节点路径和 import
pub fn change_path_name(node: &mut FileNode, obj: &RenameInfo, is_camel_case: bool) {
    if node.full_path.contains(&obj.old_name) {
        if !node.imports.is_empty() {
            for ele in node.imports.iter_mut() {
                *ele = if is_camel_case {
                    to_camel_case(&obj.old_name)
                } else {
                    to_kebab_case(ele)
                };
            }
        }
        node.full_path = node.full_path.replace(&obj.old_name, &obj.new_name);
        node.name = node.name.replace(&obj.old_name, &obj.new_name);
    }
}

/// 重命名文件或文件夹
fn replace_name_sync(full_path: &str, is_camel_case: bool, dry_run: bool) -> Result<RenameInfo> {
    let path_obj = std::path::Path::new(full_path);
    let filename = path_obj.file_name().and_then(|s| s.to_str()).unwrap_or("");
    let new_name = if is_camel_case {
        to_camel_case(filename)
    } else {
        to_kebab_case(filename)
    };

    let old_path = std::path::Path::new(full_path);
    let new_path = old_path.with_file_name(&new_name);

    if old_path.is_dir() {
        if new_path.exists() {
            if dry_run {
                println!("Dry-run: would copy dir {} -> {} and remove {}", old_path.display(), new_path.display(), old_path.display());
            } else {
                copy_dir_all_sync(old_path, &new_path)?;
                std::fs::remove_dir_all(old_path)?;
            }
        } else {
            if dry_run {
                println!("Dry-run: would rename {} -> {}", old_path.display(), new_path.display());
            } else {
                std::fs::rename(old_path, &new_path)?;
                println!("{} renamed to: {}", old_path.display(), new_path.display());
            }
        }
    } else if old_path.exists() {
        if dry_run {
            println!("Dry-run: would rename {} -> {}", old_path.display(), new_path.display());
        } else {
            std::fs::rename(old_path, &new_path)?;
            println!("{} renamed to: {}", old_path.display(), new_path.display());
        }
    } else {
        eprintln!("File {} does not exist.", old_path.display());
    }

    println!("{} is renamed done", filename);
    Ok(RenameInfo {
        new_name,
        old_name: filename.to_string(),
    })
}

/// 递归复制目录
fn copy_dir_all_sync(src: &std::path::Path, dst: &std::path::Path) -> Result<()> {
    std::fs::create_dir_all(dst)?;
    let entries = std::fs::read_dir(src)?;
    for entry in entries {
        let entry = entry?;
        let entry_path = entry.path();
        let file_name = entry.file_name();
        let dest_path = dst.join(&file_name);
        if entry_path.is_dir() {
            copy_dir_all_sync(&entry_path, &dest_path)?;
        } else {
            std::fs::copy(&entry_path, &dest_path)?;
        }
    }
    Ok(())
}
