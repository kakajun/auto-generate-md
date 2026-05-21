use agmd::rename_path::{change_path_fold, change_path_name};
use agmd::types::{FileNode, RenameInfo};
use agmd::utils::{to_kebab_case, to_camel_case};
use std::fs;


#[test]
fn test_change_path_fold() {
    let mut node = FileNode {
        name: "myFolder".to_string(),
        copyed: None,
        is_dir: true,
        level: 0,
        note: String::new(),
        size: None,
        suffix: None,
        row_size: None,
        full_path: "/project/src/myFolder".to_string(),
        belong_to: vec![],
        imports: vec![],
        children: Some(vec![
            FileNode {
                name: "child.vue".to_string(),
                copyed: None,
                is_dir: false,
                level: 1,
                note: String::new(),
                size: None,
                suffix: None,
                row_size: None,
                full_path: "/project/src/myFolder/child.vue".to_string(),
                belong_to: vec![],
                imports: vec![],
                children: None,
            },
        ]),
    };

    let rename_info = RenameInfo {
        new_name: "my-folder".to_string(),
        old_name: "myFolder".to_string(),
    };

    change_path_fold(&mut node, &rename_info);
    assert_eq!(node.name, "my-folder");
    assert_eq!(node.full_path, "/project/src/my-folder");
    let child = node.children.as_ref().unwrap().first().unwrap();
    assert!(child.full_path.contains("my-folder"));
}

#[test]
fn test_change_path_name_kebab() {
    let mut node = FileNode {
        name: "MyComponent.vue".to_string(),
        copyed: None,
        is_dir: false,
        level: 0,
        note: String::new(),
        size: None,
        suffix: None,
        row_size: None,
        full_path: "/project/src/MyComponent.vue".to_string(),
        belong_to: vec![],
        imports: vec!["/project/src/MyComponent.vue".to_string()],
        children: None,
    };

    let rename_info = RenameInfo {
        new_name: "my-component.vue".to_string(),
        old_name: "MyComponent.vue".to_string(),
    };

    change_path_name(&mut node, &rename_info, false);
    assert_eq!(node.name, "my-component.vue");
    assert_eq!(node.full_path, "/project/src/my-component.vue");
}

#[test]
fn test_to_kebab_case_comprehensive() {
    assert_eq!(to_kebab_case("HelloWorld"), "hello-world");
    assert_eq!(to_kebab_case("helloWorld"), "hello-world");
    assert_eq!(to_kebab_case("ABC"), "abc");
}

#[test]
fn test_to_camel_case_comprehensive() {
    assert_eq!(to_camel_case("hello-world"), "HelloWorld");
    assert_eq!(to_camel_case("hello_world"), "HelloWorld");
    assert_eq!(to_camel_case("abc"), "Abc");
}


/// 集成测试：验证父目录和子目录都能被正确重命名为 kebab-case
/// 对应 front1.5 中 dataBoard/newEnergyDetails 场景
#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_rename_fold_path_nested() {
    let temp_dir = tempfile::TempDir::new().unwrap();
    let root = temp_dir.path();

    let data_board = root.join("dataBoard");
    let new_energy = data_board.join("newEnergyDetails");
    let component = new_energy.join("component");
    fs::create_dir_all(&component).unwrap();

    // 创建一个匹配的文件，确保 get_file_nodes 会扫描这个目录
    let file = new_energy.join("index.vue");
    fs::write(&file, "<template></template>\n").unwrap();

    let mut nodes = Vec::new();
    let options = agmd::types::Options {
        ignore: vec![],
        include: vec![".vue".to_string()],
        dry_run: false,
        silent: false,
    };

    agmd::get_file::get_file_nodes(root, Some(&options), &mut nodes, 0, root)
        .await
        .unwrap();

    agmd::rename_path::rename_fold_path(&mut nodes, false, false)
        .await
        .unwrap();

    // 验证物理路径已被重命名
    assert!(!data_board.exists(), "dataBoard 应该已被重命名");
    assert!(
        root.join("data-board").exists(),
        "data-board 应该存在"
    );
    assert!(
        root.join("data-board/new-energy-details").exists(),
        "new-energy-details 应该存在"
    );
    assert!(
        root.join("data-board/new-energy-details/component").exists(),
        "component 子目录应该存在"
    );
}

/// 集成测试：当某个目录的物理路径不存在（或重命名失败）时，
/// rename_fold_path 应跳过该目录，继续处理其他目录
#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn test_rename_fold_path_skips_errors() {
    let temp_dir = tempfile::TempDir::new().unwrap();
    let root = temp_dir.path();

    let data_board = root.join("dataBoard");
    let new_energy = data_board.join("newEnergyDetails");
    fs::create_dir_all(&new_energy).unwrap();

    let missing = root.join("missingFolder");
    // 故意不创建 missingFolder，让它不存在

    let mut nodes = vec![
        FileNode {
            name: "missingFolder".to_string(),
            copyed: None,
            is_dir: true,
            level: 0,
            note: String::new(),
            size: None,
            suffix: None,
            row_size: None,
            full_path: missing.to_string_lossy().replace('\\', "/"),
            belong_to: vec![],
            imports: vec![],
            children: Some(vec![]),
        },
        FileNode {
            name: "dataBoard".to_string(),
            copyed: None,
            is_dir: true,
            level: 0,
            note: String::new(),
            size: None,
            suffix: None,
            row_size: None,
            full_path: data_board.to_string_lossy().replace('\\', "/"),
            belong_to: vec![],
            imports: vec![],
            children: Some(vec![FileNode {
                name: "newEnergyDetails".to_string(),
                copyed: None,
                is_dir: true,
                level: 1,
                note: String::new(),
                size: None,
                suffix: None,
                row_size: None,
                full_path: new_energy.to_string_lossy().replace('\\', "/"),
                belong_to: vec![],
                imports: vec![],
                children: Some(vec![]),
            }]),
        },
    ];

    agmd::rename_path::rename_fold_path(&mut nodes, false, false)
        .await
        .unwrap();

    // missingFolder 不存在，应该被跳过，但 dataBoard 和 newEnergyDetails 应该被重命名
    assert!(!data_board.exists(), "dataBoard 应该已被重命名");
    assert!(
        root.join("data-board").exists(),
        "data-board 应该存在"
    );
    assert!(
        root.join("data-board/new-energy-details").exists(),
        "new-energy-details 应该存在"
    );
}
