use agmd::get_file::{resolve_alias_path, get_relative_path, change_import, get_note, set_md};
use agmd::utils::get_import_name;
use agmd::types::FileNode;
use std::path::Path;

#[test]
fn test_resolve_alias_path() {
    let root = Path::new("/home/user/project");
    assert_eq!(
        resolve_alias_path("@/components/Button.vue", root),
        "/home/user/project/src/components/Button.vue"
    );
    assert_eq!(
        resolve_alias_path("@/utils/helper", root),
        "/home/user/project/src/utils/helper"
    );
    assert_eq!(
        resolve_alias_path("@", root),
        "/home/user/project/src"
    );
}

#[test]
fn test_get_relative_path() {
    let full_path = Path::new("/home/user/project/src/App.vue");
    assert_eq!(
        get_relative_path("/home/user/project/src/components/Button.vue", full_path),
        "./components/Button.vue"
    );
    assert_eq!(
        get_relative_path("/home/user/project/src/utils/helper.ts", full_path),
        "./utils/helper.ts"
    );
}

#[test]
fn test_get_import_name_with_deps() {
    let deps = vec!["vue".to_string(), "react".to_string()];

    assert_eq!(
        get_import_name(r#"import { foo } from '../components/foo'"#, &deps),
        Some("../components/foo".to_string())
    );

    assert_eq!(
        get_import_name(r#"import { ref } from 'vue'"#, &deps),
        None
    );

    assert_eq!(
        get_import_name(r#"// import { foo } from '../foo'"#, &deps),
        None
    );
}

#[test]
fn test_get_import_name_skips_absolute_paths() {
    let deps: Vec<String> = vec![];

    // 已经是 //?/ 开头的绝对路径，应该返回 None（不处理）
    let line = r#"import { foo } from '//?/E:/project/src/api/foo'"#;
    assert_eq!(get_import_name(line, &deps), None);
}

#[test]
fn test_change_import_to_relative() {
    let root = Path::new("/home/user/project");
    let full_path = Path::new("/home/user/project/src/App.vue");
    let deps: Vec<String> = vec![];

    // 测试相对路径转换
    let line = r#"import { foo } from './components/foo'"#;
    let result = change_import(line, full_path, &deps, root, false, false);
    assert!(result.is_some());
    let info = result.unwrap();
    assert_eq!(info.file_path, "./components/foo");
}

#[test]
fn test_change_import_to_alias() {
    let root = Path::new("/home/user/project");
    let full_path = Path::new("/home/user/project/src/App.vue");
    let deps: Vec<String> = vec![];

    // 测试转换为 @ 别名路径
    let line = r#"import { foo } from './components/foo'"#;
    let result = change_import(line, full_path, &deps, root, false, true);
    assert!(result.is_some());
    let info = result.unwrap();
    assert_eq!(info.imp_name, "@/components/foo");
    assert_eq!(info.file_path, "./components/foo");
}

#[test]
fn test_change_import_relative_to_alias_same_dir() {
    let root = Path::new("/home/user/project");
    let full_path = Path::new("/home/user/project/src/views/Page.vue");
    let deps: Vec<String> = vec![];

    // 同级目录的相对路径 ./mixin.js → @/views/mixin.js
    let line = r#"import mixin from './mixin.js'"#;
    let result = change_import(line, full_path, &deps, root, false, true);
    assert!(result.is_some());
    let info = result.unwrap();
    assert_eq!(info.imp_name, "@/views/mixin.js");
    assert_eq!(info.file_path, "./mixin.js");
}

#[test]
fn test_change_import_no_suffix_to_alias() {
    let root = Path::new("/home/user/project");
    let full_path = Path::new("/home/user/project/src/views/Page.vue");
    let deps: Vec<String> = vec![];

    // 没有后缀的 import，make_suffix 会补全后缀
    // 但 change_import 应该返回 @ 别名路径，而不是补全后缀的相对路径
    let line = r#"import pieChart from '../charts/pieChart'"#;
    let result = change_import(line, full_path, &deps, root, false, true);
    assert!(result.is_some());
    let info = result.unwrap();
    // 应该返回 @ 别名路径
    // 注意：make_suffix 在测试环境中无法访问真实文件，所以不会补全 .vue 后缀
    // 实际运行时，如果文件存在，会补全后缀
    assert_eq!(info.imp_name, "@/charts/pieChart");
    assert_eq!(info.file_path, "../charts/pieChart");
}

#[test]
fn test_set_md() {
    let node = FileNode {
        name: "App.vue".to_string(),
        copyed: None,
        is_dir: false,
        level: 0,
        note: "// 主应用组件".to_string(),
        size: None,
        suffix: None,
        row_size: None,
        full_path: "/project/src/App.vue".to_string(),
        belong_to: vec![],
        imports: vec![],
        children: None,
    };
    let md = set_md(&node, true);
    assert!(md.contains("App.vue"));
    assert!(md.contains("主应用组件"));
}

#[test]
fn test_get_note() {
    let nodes = vec![
        FileNode {
            name: "src".to_string(),
            copyed: None,
            is_dir: true,
            level: 0,
            note: String::new(),
            size: None,
            suffix: None,
            row_size: None,
            full_path: "/project/src".to_string(),
            belong_to: vec![],
            imports: vec![],
            children: Some(vec![
                FileNode {
                    name: "App.vue".to_string(),
                    copyed: None,
                    is_dir: false,
                    level: 1,
                    note: "// app".to_string(),
                    size: None,
                    suffix: None,
                    row_size: None,
                    full_path: "/project/src/App.vue".to_string(),
                    belong_to: vec![],
                    imports: vec![],
                    children: None,
                },
            ]),
        },
    ];
    let notes = get_note(&nodes);
    assert_eq!(notes.len(), 2);
    assert!(notes[0].contains("src"));
    assert!(notes[1].contains("App.vue"));
}
