use agmd::commands::change_path_action;
use agmd::types::Options;
use agmd::write_md::get_md;
use std::path::Path;
use std::env;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let root_path = Path::new("E:/cwd/front1.5");
    let options = Options::default();
    let (_md, mut nodes) = get_md(Some(&options), &root_path).await?;

    eprintln!("找到 {} 个文件节点", nodes.len());

    // 切换到项目根目录（与 src 平级）
    let original_dir = env::current_dir()?;
    env::set_current_dir(&root_path)?;
    eprintln!("当前工作目录: {:?}", env::current_dir()?);

    // 执行修改为相对路径
    eprintln!("调用前 nodes 长度: {}", nodes.len());
    change_path_action(&mut nodes, &root_path, false).await?;
    eprintln!("调用后 nodes 长度: {}", nodes.len());

    // 恢复工作目录
    env::set_current_dir(&original_dir)?;

    eprintln!("修改完成！");
    Ok(())
}
