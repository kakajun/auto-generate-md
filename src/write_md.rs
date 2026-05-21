use crate::get_file::{get_file_nodes, get_note};
use crate::types::{FileNode, Options, CountResult};
use crate::utils::format_number;
use anyhow::Result;
use std::path::Path;

/// 写入 Markdown 文件
pub async fn write_md(data: &str, file_path: &Path, dry_run: bool) -> Result<()> {
    if dry_run {
        println!("Dry-run: would write file {}", file_path.display());
    } else {
        tokio::fs::write(file_path, data).await?;
        println!("Write successful");
    }
    Ok(())
}

/// 获取统计数据
pub fn get_count_md(datas: &[FileNode]) -> CountResult {
    let mut row_total = 0usize;
    let mut size_total = 0usize;
    let mut count_obj = std::collections::HashMap::new();

    fn get_detail(nodes: &[FileNode], row_total: &mut usize, size_total: &mut usize, count_obj: &mut std::collections::HashMap<String, usize>) {
        for obj in nodes {
            if let Some(children) = &obj.children {
                get_detail(children, row_total, size_total, count_obj);
            } else if let (Some(suffix), Some(row_size), Some(size)) = (&obj.suffix, obj.row_size, obj.size) {
                *count_obj.entry(suffix.clone()).or_insert(0) += 1;
                *row_total += row_size;
                *size_total += size;
            }
        }
    }

    get_detail(datas, &mut row_total, &mut size_total, &mut count_obj);

    CountResult {
        row_total,
        size_total,
        count_obj,
    }
}

/// 生成统计 Markdown
pub fn set_count_md(obj: &CountResult) -> String {
    let mut count_md = "😍 代码总数统计：\n".to_string();
    let mut total = 0usize;
    for (key, ele) in &obj.count_obj {
        total += ele;
        count_md.push_str(&format!("后缀是 {} 的文件有 {} 个\n", key, ele));
    }
    count_md.push_str(&format!("总共有 {} 个文件\n", total));
    let md = format!(
        "总代码行数有: {}行,\n总代码字数有: {}个\n",
        format_number(obj.row_total),
        format_number(obj.size_total)
    );
    count_md + &md
}

/// 生成 Markdown 文档和节点
pub async fn get_md(option: Option<&Options>, root_path: &Path) -> Result<(String, Vec<FileNode>)> {
    println!("👉  命令运行位置: {}\n", root_path.display());
    let mut nodes = Vec::new();
    get_file_nodes(root_path, option, &mut nodes, 0, root_path).await?;
    let count_md_obj = get_count_md(&nodes);
    let cout_md = set_count_md(&count_md_obj);
    println!("{}", cout_md);
    let note = get_note(&nodes);
    let md = note.join("") + "\n";
    let composed = format!("# 目录结构\n{}\n## 统计\n{}", md, cout_md);
    Ok((composed, nodes))
}

/// 获取代码及结构作为提示
pub async fn write_code_and_prompt(root_path: &Path, data: &str, nodes: &[FileNode], dry_run: bool) -> Result<()> {
    let menu_st = format!("下面是整个工程的目录文件结构\n{}", data);
    let mut content = "下面是整个代码内容,其中path:是文件路径,其他是文件内容\n".to_string();

    fn find_nodes(nodes: &[FileNode], content: &mut String, root_path: &Path) -> Result<()> {
        for element in nodes {
            if let Some(children) = &element.children {
                find_nodes(children, content, root_path)?;
            } else {
                let file_str = std::fs::read_to_string(&element.full_path)?;
                let relative = element.full_path.replace(&root_path.to_string_lossy().to_string(), "");
                let file = format!("path:{}\n{}\n", relative, file_str);
                content.push_str(&file);
            }
        }
        Ok(())
    }

    find_nodes(nodes, &mut content, root_path)?;

    let out = root_path.join("codeAndPrompt.md");
    if dry_run {
        println!("Dry-run: would write file {}", out.display());
    } else {
        tokio::fs::write(&out, menu_st + &content).await?;
        println!("🀄️  生成codeAndPrompt.md完毕 !");
    }
    Ok(())
}
