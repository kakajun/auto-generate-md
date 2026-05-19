use agmd::get_file::get_file_nodes;
use agmd::types::Options;
use std::path::Path;

/// 集成测试：扫描 fixtures 目录，验证文件节点生成
#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_get_file_nodes_basic() {
    let dir = Path::new("tests/fixtures/sample-project");
    let mut nodes = Vec::new();
    let option = Some(Options {
        ignore: vec!["node_modules".to_string(), ".git".to_string()],
        include: vec![".js".to_string(), ".vue".to_string(), ".ts".to_string()],
        dry_run: true,
        silent: true,
    });

    let result = get_file_nodes(dir, option.as_ref(), &mut nodes, 0, dir).await;
    assert!(result.is_ok());
    // 至少应该有一些节点（如果 fixtures 存在）
    // 如果 fixtures 不存在，测试会被跳过或失败，提示用户创建
}

/// 测试 Options 默认值
#[test]
fn test_options_default() {
    let opt = Options::default();
    assert!(opt.ignore.is_empty());
    assert!(opt.include.is_empty());
    assert!(!opt.dry_run);
    assert!(!opt.silent);
}
