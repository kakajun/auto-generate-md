use agmd::utils::{format_number, to_camel_case, to_kebab_case, check_camel_file, check_upper_camel_file, get_import_name};

#[test]
fn test_to_kebab_case() {
    assert_eq!(to_kebab_case("HelloWorld"), "hello-world");
    assert_eq!(to_kebab_case("helloWorld"), "hello-world");
    assert_eq!(to_kebab_case("Hello"), "hello");
    assert_eq!(to_kebab_case("hello"), "hello");
    assert_eq!(to_kebab_case("XMLHttpRequest"), "x-m-l-http-request");
    assert_eq!(to_kebab_case(""), "");
}

#[test]
fn test_to_camel_case() {
    assert_eq!(to_camel_case("hello-world"), "HelloWorld");
    assert_eq!(to_camel_case("hello_world"), "HelloWorld");
    assert_eq!(to_camel_case("hello"), "Hello");
    assert_eq!(to_camel_case(""), "");
}

#[test]
fn test_format_number() {
    assert_eq!(format_number(0), "0");
    assert_eq!(format_number(100), "100");
    assert_eq!(format_number(1000), "1,000");
    assert_eq!(format_number(1234567), "1,234,567");
}

#[test]
fn test_check_camel_file() {
    assert!(check_camel_file("HelloWorld.vue"));
    assert!(check_camel_file("helloWorld.js"));
    assert!(!check_camel_file("hello-world.vue"));
    assert!(!check_camel_file("hello.vue"));
}

#[test]
fn test_check_upper_camel_file() {
    assert!(check_upper_camel_file("HelloWorld.vue"));
    assert!(!check_upper_camel_file("hello-world.vue"));
    assert!(!check_upper_camel_file("hello.vue"));
}

#[test]
fn test_get_import_name() {
    let deps = vec!["vue".to_string(), "react".to_string()];

    // 正常 import
    let line = r#"import { foo } from '../components/foo'"#;
    assert_eq!(get_import_name(line, &deps), Some("../components/foo".to_string()));

    // 排除插件依赖
    let line = r#"import { ref } from 'vue'"#;
    assert_eq!(get_import_name(line, &deps), None);

    // 排除无斜杠的
    let line = r#"import { foo } from 'lodash'"#;
    assert_eq!(get_import_name(line, &deps), None);

    // 排除注释行
    let line = r#"// import { foo } from '../foo'"#;
    assert_eq!(get_import_name(line, &deps), None);

    // 无 import
    let line = r#"const a = 1"#;
    assert_eq!(get_import_name(line, &deps), None);
}
