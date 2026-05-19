use crate::mark_file::find_nodes;
use crate::types::{FileNode, RouterItem};
use anyhow::Result;
use std::path::Path;

/// 将 @ 路径解析为 src 目录下的绝对路径
fn resolve_alias_path(path_n: &str, root_path: &Path) -> String {
    let src_path = root_path.join("src");
    path_n.replace('@', &src_path.to_string_lossy())
}

fn write_mark_file_sync(nodes: &mut [FileNode], routers: &[RouterItem], root_path: &Path, dry_run: bool) -> Result<()> {
    for ele in routers {
        for obj in &ele.router {
            let path_n = &obj.component;
            let absolute_path = resolve_alias_path(path_n, root_path);
            mark_write_file_sync(nodes, &ele.name, &absolute_path, root_path, dry_run)?;
        }
    }
    Ok(())
}

/// 对打上标记的文件进行分类写入
pub async fn write_mark_file(nodes: &mut [FileNode], routers: &[RouterItem], root_path: &Path, dry_run: bool) -> Result<()> {
    tokio::task::block_in_place(|| write_mark_file_sync(nodes, routers, root_path, dry_run))
}

/// 递归文件子依赖创建文件
fn mark_write_file_sync(
    nodes: &mut [FileNode],
    name: &str,
    path: &str,
    root_path: &Path,
    dry_run: bool,
) -> Result<()> {
    let node = find_nodes(nodes, path);
    if node.is_none() {
        return Ok(());
    }
    // 需要可变引用来设置 copyed，这里我们先用 find_nodes_mut
    if let Some(node_mut) = find_nodes_mut(nodes, path) {
        if node_mut.copyed == Some(true) {
            return Ok(());
        }
        node_mut.copyed = Some(true);
        if !node_mut.belong_to.is_empty() {
            set_disp_file_new_sync(path, name, root_path, dry_run)?;
        }
        let imports = node_mut.imports.clone();
        for element in imports {
            if Path::new(&element).exists() {
                mark_write_file_sync(nodes, name, &element, root_path, dry_run)?;
            } else {
                eprintln!("{} 文件不存在", element);
            }
        }
    }
    Ok(())
}

/// 可变版本 find_nodes
fn find_nodes_mut<'a>(nodes: &'a mut [FileNode], path: &str) -> Option<&'a mut FileNode> {
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

/// 复制文件到指定位置
fn set_disp_file_new_sync(path_n: &str, name: &str, root_path: &Path, dry_run: bool) -> Result<()> {
    let relative = path_n.replace(&root_path.to_string_lossy().to_string(), "");
    let write_file_name = root_path.join(name).join(&relative.trim_start_matches('/').trim_start_matches('\\'));

    if write_file_name.exists() {
        return Ok(());
    }

    if dry_run {
        println!("Dry-run: would copy file to: {}", write_file_name.display());
    } else {
        if let Some(parent) = write_file_name.parent() {
            std::fs::create_dir_all(parent)?;
        }
        std::fs::copy(path_n, &write_file_name)?;
        println!("写入文件success! : {}", write_file_name.display());
    }
    Ok(())
}
