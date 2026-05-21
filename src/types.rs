use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Router {
    pub path: String,
    pub component: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RouterItem {
    pub name: String,
    pub router: Vec<Router>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct Options {
    pub ignore: Vec<String>,
    pub include: Vec<String>,
    pub dry_run: bool,
    pub silent: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileNode {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub copyed: Option<bool>,
    pub is_dir: bool,
    pub level: usize,
    pub note: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub size: Option<usize>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub suffix: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub row_size: Option<usize>,
    pub full_path: String,
    pub belong_to: Vec<String>,
    pub imports: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub children: Option<Vec<FileNode>>,
}

#[derive(Debug, Clone)]
pub struct CountResult {
    pub row_total: usize,
    pub size_total: usize,
    pub count_obj: std::collections::HashMap<String, usize>,
}

#[derive(Debug, Clone)]
pub struct RenameInfo {
    pub new_name: String,
    pub old_name: String,
}
