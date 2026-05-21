use agmd::commands::rename_keb_fold_action;
use agmd::get_file::get_file_nodes;
use agmd::types::Options;
use std::path::Path;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let root_path = Path::new(r"E:\cwd\front1.5");
    let mut nodes = Vec::new();

    let options = Options {
        ignore: vec![],
        include: vec![".js".to_string(), ".vue".to_string(), ".ts".to_string(), ".tsx".to_string()],
        dry_run: false,
        silent: false,
    };

    get_file_nodes(root_path, Some(&options), &mut nodes, 0, root_path).await?;

    println!("=== scan folders with uppercase in name ===");
    print_camel_folders(&nodes, 0);

    println!("\n=== start real rename_keb_fold_action ===");
    rename_keb_fold_action(&mut nodes, false).await?;

    println!("\n=== done ===");
    Ok(())
}

fn print_camel_folders(nodes: &[agmd::types::FileNode], depth: usize) {
    for node in nodes {
        if node.is_dir {
            let has_upper = node.name.chars().any(|c| c.is_uppercase());
            let indent = "  ".repeat(depth);
            if has_upper {
                println!("{}{}/  [NEED RENAME]", indent, node.name);
            } else {
                println!("{}{}/", indent, node.name);
            }
            if let Some(children) = &node.children {
                print_camel_folders(children, depth + 1);
            }
        }
    }
}
