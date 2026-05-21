use crate::types::{FileNode, RouterItem};
use anyhow::Result;
use std::path::Path;

/// 将 @ 路径解析为 src 目录下的绝对路径
fn resolve_alias_path(path_n: &str, root_path: &Path) -> String {
    let src_path = root_path.join("src");
    path_n.replace('@', &src_path.to_string_lossy())
}

/// 标记文件主程序
pub async fn mark_file(nodes: &mut [FileNode], routers: &[RouterItem], root_path: &Path, dry_run: bool) -> Result<()> {
    for ele in routers {
        for obj in &ele.router {
            let path_n = &obj.component;
            println!("准备处理{}", obj.path);
            let absolute_path = resolve_alias_path(path_n, root_path);
            tokio::task::block_in_place(|| {
                set_node_mark_sync(nodes, &ele.name, &absolute_path, root_path, dry_run)
            })?;
        }
    }
    Ok(())
}

/// 递归打上标记
fn set_node_mark_sync(
    nodes: &mut [FileNode],
    name: &str,
    path: &str,
    root_path: &Path,
    dry_run: bool,
) -> Result<()> {
    println!("set_node_mark入参: {} {}", name, path);
    if let Some(node) = find_nodes_mut(nodes, path) {
        set_mark_sync(path, name, dry_run)?;
        if !node.imports.is_empty() {
            if node.belong_to.contains(&name.to_string()) {
                return Ok(());
            }
            node.belong_to.push(name.to_string());
            let imports = node.imports.clone();
            for element in imports {
                if Path::new(&element).exists() {
                    set_node_mark_sync(nodes, name, &element, root_path, dry_run)?;
                } else {
                    eprintln!("文件不存在: {}", element);
                }
            }
        }
    }
    Ok(())
}

/// 递归通过文件全名找节点（可变引用）
pub fn find_nodes_mut<'a>(nodes: &'a mut [FileNode], path: &str) -> Option<&'a mut FileNode> {
    for i in 0..nodes.len() {
        let has_children = unsafe { (*(&mut nodes[i] as *mut FileNode)).children.is_some() };
        if has_children {
            let children = unsafe { (*(&mut nodes[i] as *mut FileNode)).children.as_mut().unwrap() };
            if let Some(found) = find_nodes_mut(children, path) {
                return Some(found);
            }
        }
        let ptr = unsafe { &mut *(&mut nodes[i] as *mut FileNode) };
        if ptr.full_path == path {
            return Some(ptr);
        }
    }
    None
}

/// 递归通过文件全名找节点（不可变引用）
pub fn find_nodes<'a>(nodes: &'a [FileNode], path: &str) -> Option<&'a FileNode> {
    for node in nodes.iter() {
        if let Some(children) = node.children.as_ref() {
            if let Some(found) = find_nodes(children, path) {
                return Some(found);
            }
        }
        if node.full_path == path {
            return Some(node);
        }
    }
    None
}

/// 给文件添加标记
fn set_mark_sync(file: &str, name: &str, dry_run: bool) -> Result<()> {
    let mut file_str = std::fs::read_to_string(file)?;
    let mark = format!("//{}\n", name);
    if !file_str.starts_with(&mark) {
        file_str = mark + &file_str;
        if dry_run {
            println!("Dry-run: would add mark to {}", file);
        } else {
            std::fs::write(file, file_str)?;
            println!("Mark added successfully to: {}", file);
        }
    }
    Ok(())
}

fn delete_mark_all_sync(nodes: &mut [FileNode], name: &str, dry_run: bool) -> Result<()> {
    for node in nodes.iter_mut() {
        if let Some(children) = node.children.as_mut() {
            delete_mark_all_sync(children, name, dry_run)?;
        } else {
            delete_mark_sync(&node.full_path, name, dry_run)?;
        }
    }
    Ok(())
}

/// 递归所有文件，删除所有标记
pub async fn delete_mark_all(nodes: &mut [FileNode], name: &str, dry_run: bool) -> Result<()> {
    tokio::task::block_in_place(|| delete_mark_all_sync(nodes, name, dry_run))
}

/// 删除单个文件的标记
fn delete_mark_sync(file: &str, name: &str, dry_run: bool) -> Result<String> {
    let file_str = std::fs::read_to_string(file)?;
    let mut lines: Vec<String> = file_str.lines().map(|s| s.to_string()).collect();
    let mut changed = false;
    let mark = format!("//{}", name);
    lines.retain(|line| {
        if line.contains(&mark) {
            changed = true;
            false
        } else {
            true
        }
    });
    if changed {
        let new_content = lines.join("\n");
        if dry_run {
            println!("Dry-run: would delete mark in {}", file);
        } else {
            std::fs::write(file, &new_content)?;
            println!("delete mark successful-------{}", file);
        }
        Ok(new_content)
    } else {
        Ok(file_str)
    }
}
