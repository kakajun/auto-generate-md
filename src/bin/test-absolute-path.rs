use agmd::commands::change_absolute_path_action;
use agmd::types::Options;
use agmd::write_md::get_md;
use std::path::Path;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let root_path = Path::new("E:/cwd/front1.5");
    let options = Options::default();
    let (_md, mut nodes) = get_md(Some(&options), &root_path).await?;

    eprintln!("找到 {} 个文件节点", nodes.len());

    // 打印所有节点路径
    fn print_nodes(nodes: &[agmd::types::FileNode], depth: usize) {
        for node in nodes {
            let indent = "  ".repeat(depth);
            eprintln!("{}{} ({})", indent, node.name, node.full_path);
            if let Some(ref children) = node.children {
                print_nodes(children, depth + 1);
            }
        }
    }
    print_nodes(&nodes, 0);

    // 执行修改为绝对路径
    eprintln!("调用前 nodes 长度: {}", nodes.len());
    change_absolute_path_action(&mut nodes, &root_path, false).await?;
    eprintln!("调用后 nodes 长度: {}", nodes.len());

    eprintln!("修改完成！");
    Ok(())
}
