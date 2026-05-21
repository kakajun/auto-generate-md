use agmd::commands::rename_cam_fold_action;
use agmd::get_file::get_file_nodes;
use agmd::types::Options;
use std::path::Path;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let root_path = Path::new(r"E:\cwd\front1.5");
    let scan_path = root_path.join("src/views/dataBoard");
    let mut nodes = Vec::new();

    let options = Options {
        ignore: vec!["node_modules".to_string(), ".git".to_string()],
        include: vec![".js".to_string(), ".vue".to_string(), ".ts".to_string(), ".tsx".to_string()],
        dry_run: false,
        silent: false,
    };

    get_file_nodes(&scan_path, Some(&options), &mut nodes, 0, root_path).await?;

    println!("=== start real rename_cam_fold_action ===");
    rename_cam_fold_action(&mut nodes, false).await?;
    println!("\n=== done ===");
    Ok(())
}
