use crate::types::{Router, RouterItem};
use crate::utils::{parse_component_path, parse_router_path};
use anyhow::Result;
use std::path::Path;

fn get_router_file_path_sync(dir: &Path) -> Result<Vec<String>> {
    let mut routes = Vec::new();
    let entries = std::fs::read_dir(dir)?;
    for entry in entries {
        let entry = entry?;
        let f_path = entry.path();
        let meta = entry.metadata()?;
        if meta.is_dir() {
            let sub = get_router_file_path_sync(&f_path)?;
            routes.extend(sub);
        } else if meta.is_file() {
            routes.push(f_path.to_string_lossy().replace('\\', "/"));
        }
    }
    Ok(routes)
}

/// 递归获取路由文件路径
pub async fn get_router_file_path(dir: &Path) -> Result<Vec<String>> {
    tokio::task::block_in_place(|| get_router_file_path_sync(dir))
}

/// 获取所有路由
pub async fn get_all_router(dir: &Path) -> Result<Vec<Router>> {
    let file_paths = get_router_file_path(dir).await?;
    let mut routers = Vec::new();
    for file_path in file_paths {
        let items = get_router(&file_path).await?;
        routers.extend(items);
    }
    Ok(routers)
}

/// 解析单个路由文件
pub async fn get_router(router_path: &str) -> Result<Vec<Router>> {
    let mut routers = Vec::new();
    if let Ok(content) = tokio::fs::read_to_string(router_path).await {
        let mut current_path = String::new();
        let mut current_component = String::new();
        for line in content.lines() {
            if line.starts_with("//") {
                continue;
            }
            if let Some(temp_path) = parse_router_path(line) {
                current_path = temp_path;
            }
            if let Some(temp_component) = parse_component_path(line) {
                current_component = temp_component;
            }
            if !current_path.is_empty() && !current_component.is_empty() {
                routers.push(Router {
                    path: current_path.clone(),
                    component: current_component.clone(),
                });
                current_path.clear();
                current_component.clear();
            }
        }
    }
    Ok(routers)
}

/// 获取要操作的路由
pub async fn get_router_arrs(root_path: &Path) -> Result<Vec<RouterItem>> {
    let path_name = root_path.join("classify.js");
    let dir = root_path.join("router");

    if path_name.exists() {
        // 尝试读取 classify.js 并解析
        let content = tokio::fs::read_to_string(&path_name).await?;
        // 简单解析：移除 export default 等前缀，尝试解析 JSON
        let trimmed = content
            .trim()
            .replace("export default", "")
            .replace("module.exports =", "")
            .replace("const router =", "");
        let trimmed = trimmed.trim().trim_start_matches('=').trim();
        // 尝试解析为 JSON
        if let Ok(routers) = serde_json::from_str::<Vec<RouterItem>>(&trimmed) {
            return Ok(routers);
        }
        // 如果解析失败，尝试找 router 目录
        if dir.exists() {
            return Ok(vec![RouterItem {
                name: "mark".to_string(),
                router: get_all_router(&dir).await?,
            }]);
        }
    } else if dir.exists() {
        return Ok(vec![RouterItem {
            name: "mark".to_string(),
            router: get_all_router(&dir).await?,
        }]);
    }

    eprintln!("根路径没有发现 classify.js，并且 src 里面没有 router 文件，现在退出");
    std::process::exit(1);
}
