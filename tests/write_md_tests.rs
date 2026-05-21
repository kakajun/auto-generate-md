use agmd::write_md::{get_count_md, set_count_md};
use agmd::types::{FileNode, CountResult};

#[test]
fn test_get_count_md() {
    let nodes = vec![
        FileNode {
            name: "App.vue".to_string(),
            copyed: None,
            is_dir: false,
            level: 0,
            note: String::new(),
            size: Some(100),
            suffix: Some(".vue".to_string()),
            row_size: Some(10),
            full_path: "/project/src/App.vue".to_string(),
            belong_to: vec![],
            imports: vec![],
            children: None,
        },
        FileNode {
            name: "main.js".to_string(),
            copyed: None,
            is_dir: false,
            level: 0,
            note: String::new(),
            size: Some(200),
            suffix: Some(".js".to_string()),
            row_size: Some(20),
            full_path: "/project/src/main.js".to_string(),
            belong_to: vec![],
            imports: vec![],
            children: None,
        },
    ];
    let result = get_count_md(&nodes);
    assert_eq!(result.row_total, 30);
    assert_eq!(result.size_total, 300);
    assert_eq!(result.count_obj.get(".vue"), Some(&1));
    assert_eq!(result.count_obj.get(".js"), Some(&1));
}

#[test]
fn test_set_count_md() {
    let count_result = CountResult {
        row_total: 1234,
        size_total: 5678,
        count_obj: {
            let mut map = std::collections::HashMap::new();
            map.insert(".vue".to_string(), 5);
            map.insert(".js".to_string(), 3);
            map
        },
    };
    let md = set_count_md(&count_result);
    assert!(md.contains(".vue"));
    assert!(md.contains(".js"));
    assert!(md.contains("1,234"));
    assert!(md.contains("5,678"));
    assert!(md.contains("8")); // 总文件数 5+3
}
