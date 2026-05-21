pub mod types;
pub mod utils;
pub mod get_file;
pub mod write_md;
pub mod change_path;
pub mod rename_path;
pub mod get_router;
pub mod mark_file;
pub mod mark_write_file;
pub mod commands;
pub mod cli;

use crate::get_file::get_file_nodes;
use crate::types::{FileNode, Options};
use crate::write_md::get_md;
use std::path::Path;

/// 公开 API：获取文件节点
pub async fn get_file_nodes_api(dir: &Path, option: Option<&Options>) -> anyhow::Result<Vec<FileNode>> {
    let mut nodes = Vec::new();
    get_file_nodes(dir, option, &mut nodes, 0, dir).await?;
    Ok(nodes)
}

/// 公开 API：获取 Markdown
pub async fn get_md_api(option: Option<&Options>, root_path: &Path) -> anyhow::Result<(String, Vec<FileNode>)> {
    get_md(option, root_path).await
}
