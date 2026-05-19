use crate::types::{FileNode, Options};
use crate::utils::{default_ignore, default_include, get_dependencies, get_import_name};
use anyhow::Result;
use regex::Regex;

use std::path::{Path, PathBuf};

/// 获取文件的头部注释和基本信息
pub async fn get_file_info(full_path: &Path, root_path: &Path) -> Result<(String, usize, usize, Vec<String>)> {
    let content = tokio::fs::read_to_string(full_path).await?;
    let size = content.len();
    let lines: Vec<&str> = content.lines().collect();
    let row_size = lines.len();

    let package_json_path = root_path.join("package.json");
    let dependencies = get_dependencies(&package_json_path);
    let imports = get_imports(&lines, full_path, &dependencies, root_path)?;

    let note = if let Some(first_line) = lines.first() {
        if !first_line.contains("eslint")
            && (first_line.contains("-->") || first_line.contains("*/") || first_line.starts_with("//"))
        {
            let re = Regex::new(r"</?[^>]*>|(\n|\r)").unwrap();
            re.replace_all(first_line, "").to_string()
        } else {
            String::new()
        }
    } else {
        String::new()
    };

    Ok((note, size, row_size, imports))
}

/// 获取文件的所有 import 依赖
fn get_imports(lines: &[&str], full_path: &Path, dependencies: &[String], root_path: &Path) -> Result<Vec<String>> {
    let mut imports = Vec::new();
    for line in lines {
        if line.contains("from") {
            if let Some(obj) = change_import(line, full_path, dependencies, root_path, false, false) {
                if let Some(absolute) = obj.absolute_import {
                    imports.push(absolute);
                }
            }
        }
    }
    Ok(imports)
}

/// 将 @ 路径解析为 src 目录下的绝对路径
pub fn resolve_alias_path(file_path: &str, root_path: &Path) -> String {
    let src_path = root_path.join("src");
    file_path.replace('@', &src_path.to_string_lossy().replace('\\', "/"))
}

/// 补全文件后缀
pub fn make_suffix(file_path: &str, full_path: &Path, root_path: &Path) -> String {
    let absolute_import = if file_path.contains('@') {
        resolve_alias_path(file_path, root_path)
    } else {
        let dir = full_path.parent().unwrap_or(Path::new(""));
        let joined = dir.join(file_path);
        joined
            .canonicalize()
            .unwrap_or(joined)
            .to_string_lossy()
            .to_string()
    };

    // 清理 Windows UNC 路径前缀 \\?\
    let cleaned = if absolute_import.starts_with(r"\\?\") {
        absolute_import[4..].to_string()
    } else {
        absolute_import
    };

    let path_obj = Path::new(&cleaned);
    if path_obj.extension().is_none() {
        let suffixes = [".ts", ".vue", ".tsx", ".js", "/index.js", "/index.vue"];
        for suffix in &suffixes {
            let test_path = format!("{}{}", cleaned, suffix);
            if Path::new(&test_path).exists() {
                return test_path.replace('\\', "/");
            }
        }
    }
    cleaned.replace('\\', "/")
}

/// 获取相对路径
pub fn get_relative_path(absolute_import: &str, full_path: &Path) -> String {
    let dir = full_path.parent().unwrap_or(Path::new(""));
    let relat = pathdiff::diff_paths(absolute_import, dir)
        .unwrap_or_else(|| PathBuf::from(absolute_import))
        .to_string_lossy()
        .replace('\\', "/");
    if relat.starts_with('.') {
        relat
    } else {
        format!("./{}", relat)
    }
}

/// 解析 import 并返回转换后的信息
#[derive(Debug, Clone)]
pub struct ImportInfo {
    pub imp_name: String,
    pub file_path: String,
    pub absolute_import: Option<String>,
}

pub fn change_import(
    line: &str,
    full_path: &Path,
    dependencies: &[String],
    root_path: &Path,
    no_change_path: bool,
    to_absolute_alias: bool,
) -> Option<ImportInfo> {
    let imp_name = get_import_name(line, dependencies)?;
    let absolute_import = make_suffix(&imp_name, full_path, root_path);

    // 计算 @ 别名路径：将绝对路径中的 {root}/src 替换为 @
    // 注意：Windows 路径分隔符是 \，需要统一替换为 / 后再匹配
    let normalized_abs = absolute_import.replace('\\', "/");
    let src_path = root_path.join("src");
    let src_str = src_path.to_string_lossy().to_string().replace('\\', "/");
    let alias_path = normalized_abs.replace(&src_str, "@").replace("/./", "/");
    // 清理 .. 路径（如 @/views/../charts → @/charts）
    let alias_path = if alias_path.contains("/../") {
        let parts: Vec<&str> = alias_path.split('/').collect();
        let mut result = Vec::new();
        for part in &parts {
            if *part == ".." && !result.is_empty() {
                result.pop();
            } else {
                result.push(*part);
            }
        }
        result.join("/")
    } else {
        alias_path
    };

    let final_name = if no_change_path {
        // 补全后缀模式：保持原始路径结构，但补全缺失的后缀
        if imp_name.contains('@') {
            alias_path
        } else {
            get_relative_path(&absolute_import, full_path)
        }
    } else if to_absolute_alias {
        alias_path
    } else {
        get_relative_path(&absolute_import, full_path)
    };

    Some(ImportInfo {
        imp_name: final_name,
        file_path: imp_name,
        absolute_import: Some(absolute_import),
    })
}

/// 获取文件或目录的信息
fn get_file_item(dir: &Path, item: &str, level: usize) -> FileNode {
    let full_path = dir.join(item);
    let is_dir = full_path.is_dir();
    FileNode {
        name: item.to_string(),
        copyed: None,
        is_dir,
        level,
        note: String::new(),
        size: None,
        suffix: None,
        row_size: None,
        full_path: full_path.to_string_lossy().replace('\\', "/"),
        belong_to: Vec::new(),
        imports: Vec::new(),
        children: if is_dir { Some(Vec::new()) } else { None },
    }
}

/// 对文件和目录进行排序
fn sort_files(files: &mut [FileNode]) {
    files.sort_by(|a, b| {
        match (a.is_dir, b.is_dir) {
            (false, true) => std::cmp::Ordering::Greater,
            (true, false) => std::cmp::Ordering::Less,
            _ => std::cmp::Ordering::Equal,
        }
    });
}

fn get_file_nodes_sync(
    dir: &Path,
    option: Option<&Options>,
    nodes: &mut Vec<FileNode>,
    level: usize,
    root_path: &Path,
) -> Result<()> {
    let mut ignore_list = default_ignore();
    let mut include_list = default_include();

    if let Some(opt) = option {
        if !opt.ignore.is_empty() {
            ignore_list = opt.ignore.clone();
        }
        if !opt.include.is_empty() {
            include_list = opt.include.clone();
        }
    }

    let entries = std::fs::read_dir(dir)?;
    let mut temp_files = Vec::new();

    for entry in entries {
        let entry = entry?;
        let name = entry.file_name().to_string_lossy().to_string();
        temp_files.push(get_file_item(dir, &name, level));
    }

    sort_files(&mut temp_files);

    for item in temp_files {
        if ignore_list.contains(&item.name) {
            continue;
        }
        if item.is_dir {
            let child_dir = dir.join(&item.name);
            let mut children = Vec::new();
            get_file_nodes_sync(&child_dir, option, &mut children, level + 1, root_path)?;
            let mut item = item;
            item.children = Some(children);
            item.full_path = child_dir.to_string_lossy().replace('\\', "/");
            nodes.push(item);
        } else {
            let full_path = dir.join(&item.name);
            if let Some(suffix) = full_path.extension().and_then(|s| s.to_str()) {
                let ext = format!(".{}", suffix);
                if include_list.contains(&ext) {
                    let (note, size, row_size, imports) = get_file_info_sync(&full_path, root_path)?;
                    let mut item = item;
                    item.note = note;
                    item.size = Some(size);
                    item.row_size = Some(row_size);
                    item.suffix = Some(ext);
                    item.full_path = full_path.to_string_lossy().replace('\\', "/");
                    item.imports = imports;
                    nodes.push(item);
                }
            }
        }
    }

    Ok(())
}

/// 同步版本获取文件信息
fn get_file_info_sync(full_path: &Path, root_path: &Path) -> Result<(String, usize, usize, Vec<String>)> {
    let content = std::fs::read_to_string(full_path)?;
    let size = content.len();
    let lines: Vec<&str> = content.lines().collect();
    let row_size = lines.len();

    let package_json_path = root_path.join("package.json");
    let dependencies = get_dependencies(&package_json_path);
    let imports = get_imports(&lines, full_path, &dependencies, root_path)?;

    let note = if let Some(first_line) = lines.first() {
        if !first_line.contains("eslint")
            && (first_line.contains("-->") || first_line.contains("*/") || first_line.starts_with("//"))
        {
            let re = Regex::new(r"</?[^>]*>|(\n|\r)").unwrap();
            re.replace_all(first_line, "").to_string()
        } else {
            String::new()
        }
    } else {
        String::new()
    };

    Ok((note, size, row_size, imports))
}

/// 递归生成所有文件的节点信息
pub async fn get_file_nodes(
    dir: &Path,
    option: Option<&Options>,
    nodes: &mut Vec<FileNode>,
    level: usize,
    root_path: &Path,
) -> Result<()> {
    tokio::task::block_in_place(|| get_file_nodes_sync(dir, option, nodes, level, root_path))
}

/// 递归生成 Markdown 树形文本
pub fn get_note(datas: &[FileNode]) -> Vec<String> {
    let mut nodes = Vec::new();
    for (index, obj) in datas.iter().enumerate() {
        let last = index == datas.len() - 1;
        let md = set_md(obj, last);
        nodes.push(md);
        if let Some(children) = &obj.children {
            let child_notes = get_note(children);
            nodes.extend(child_notes);
        }
    }
    nodes
}

/// 单个节点生成一行 Markdown
pub fn set_md(obj: &FileNode, last: bool) -> String {
    let blank = "│ ".repeat(obj.level);
    let pre = format!("{}{} {}", blank, if last { "└──" } else { "├──" }, obj.name);
    if obj.is_dir {
        format!("{}\n", pre)
    } else {
        format!("{}            {}\n", pre, obj.note)
    }
}
