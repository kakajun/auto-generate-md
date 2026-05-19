use agmd::rename_path::{change_path_fold, change_path_name};
use agmd::types::{FileNode, RenameInfo};
use agmd::utils::{to_kebab_case, to_camel_case};

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
