use agmd::get_file::{change_import, get_file_nodes};
use agmd::types::Options;
use std::path::Path;
use std::fs;
use tempfile::TempDir;

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

/// 集成测试：在真实文件系统上测试 change_import 补全后缀并转换为 @ 别名
#[test]
fn test_change_import_with_real_file_suffix_completion() {
    // 创建临时目录结构：模拟项目 src/views/Page.vue 和 src/charts/pieChart.vue
    let temp_dir = TempDir::new().unwrap();
    let root = temp_dir.path();

    // 创建 src 目录
    let src_dir = root.join("src");
    fs::create_dir(&src_dir).unwrap();

    // 创建 views 目录和 Page.vue
    let views_dir = src_dir.join("views");
    fs::create_dir(&views_dir).unwrap();
    let page_vue = views_dir.join("Page.vue");
    fs::write(&page_vue, "<template><div>Page</div></template>\n").unwrap();

    // 创建 charts 目录和 pieChart.vue（无后缀 import 的目标文件）
    let charts_dir = src_dir.join("charts");
    fs::create_dir(&charts_dir).unwrap();
    let pie_chart_vue = charts_dir.join("pieChart.vue");
    fs::write(&pie_chart_vue, "<template><div>Chart</div></template>\n").unwrap();

    // 测试：从 Page.vue 中 import '../charts/pieChart'（无后缀）
    let line = r#"import pieChart from '../charts/pieChart'"#;
    let deps: Vec<String> = vec![];
    let result = change_import(line, &page_vue, &deps, root, false, true);

    assert!(result.is_some(), "change_import 应该返回结果");
    let info = result.unwrap();

    // 关键断言：make_suffix 应该补全 .vue 后缀，并转换为 @ 别名
    assert_eq!(
        info.imp_name, "@/charts/pieChart.vue",
        "应该补全 .vue 后缀并转换为 @ 别名路径，但实际得到: {}",
        info.imp_name
    );
    assert_eq!(info.file_path, "../charts/pieChart");
}

/// 端到端测试：模拟 write_to_file_sync 的实际替换逻辑
#[test]
fn test_write_to_file_sync_replacement_logic() {
    use agmd::change_path::change_path_sync;
    use agmd::types::FileNode;

    let temp_dir = TempDir::new().unwrap();
    let root = temp_dir.path();

    // 创建目录结构
    let src_dir = root.join("src");
    fs::create_dir(&src_dir).unwrap();
    let views_dir = src_dir.join("views");
    fs::create_dir(&views_dir).unwrap();
    let charts_dir = src_dir.join("charts");
    fs::create_dir(&charts_dir).unwrap();

    // 创建 Page.vue，包含无后缀的 import
    let page_vue = views_dir.join("Page.vue");
    let original_content = "import pieChart from '../charts/pieChart'\n<template><div>Page</div></template>\n";
    fs::write(&page_vue, original_content).unwrap();

    // 创建 pieChart.vue
    let pie_chart_vue = charts_dir.join("pieChart.vue");
    fs::write(&pie_chart_vue, "<template><div>Chart</div></template>\n").unwrap();

    // 创建 package.json（空依赖）
    fs::write(root.join("package.json"), "{}").unwrap();

    // 创建 FileNode
    let mut nodes = vec![FileNode {
        name: "Page.vue".to_string(),
        copyed: None,
        is_dir: false,
        level: 0,
        note: String::new(),
        size: None,
        suffix: None,
        row_size: None,
        full_path: page_vue.to_string_lossy().to_string(),
        belong_to: vec![],
        imports: vec![],
        children: None,
    }];

    // 执行 change_path_sync（to_absolute_alias = true）
    let result = change_path_sync(&mut nodes, root, false, true, false);
    assert!(result.is_ok());

    // 读取修改后的文件内容
    let new_content = fs::read_to_string(&page_vue).unwrap();
    println!("原始内容: {}", original_content);
    println!("修改后内容: {}", new_content);

    // 关键断言：import 路径应该被替换为 @ 别名，并且补全了 .vue 后缀
    assert!(
        new_content.contains("@/charts/pieChart.vue"),
        "文件内容应该包含 '@/charts/pieChart.vue'，但实际内容: {}",
        new_content
    );
    assert!(
        !new_content.contains("../charts/pieChart"),
        "文件内容不应该再包含 '../charts/pieChart'，但实际内容: {}",
        new_content
    );
}

/// 端到端测试：同级目录无后缀 import 转换为 @ 别名
#[test]
fn test_write_to_file_sync_same_dir_no_suffix() {
    use agmd::change_path::change_path_sync;
    use agmd::types::FileNode;

    let temp_dir = TempDir::new().unwrap();
    let root = temp_dir.path();

    // 创建目录结构：src/views/TinyMce.vue 和 src/components/editorImage.vue
    let src_dir = root.join("src");
    fs::create_dir(&src_dir).unwrap();
    let views_dir = src_dir.join("views");
    fs::create_dir(&views_dir).unwrap();
    let components_dir = src_dir.join("components");
    fs::create_dir(&components_dir).unwrap();

    // 创建 TinyMce.vue，包含无后缀的 import（从 views 目录引用 components）
    let tinymce_vue = views_dir.join("TinyMce.vue");
    let original_content = "<script>\nimport editorImage from '../components/editorImage'\n\nexport default {\n  name: 'tinymce',\n}\n</script>\n";
    fs::write(&tinymce_vue, original_content).unwrap();

    // 创建 editorImage.vue
    let editor_image_vue = components_dir.join("editorImage.vue");
    fs::write(&editor_image_vue, "<template><div>Image Editor</div></template>\n").unwrap();

    // 创建 package.json（空依赖）
    fs::write(root.join("package.json"), "{}").unwrap();

    // 创建 FileNode
    let mut nodes = vec![FileNode {
        name: "TinyMce.vue".to_string(),
        copyed: None,
        is_dir: false,
        level: 0,
        note: String::new(),
        size: None,
        suffix: None,
        row_size: None,
        full_path: tinymce_vue.to_string_lossy().to_string(),
        belong_to: vec![],
        imports: vec![],
        children: None,
    }];

    // 执行 change_path_sync（to_absolute_alias = true）
    let result = change_path_sync(&mut nodes, root, false, true, false);
    assert!(result.is_ok());

    // 读取修改后的文件内容
    let new_content = fs::read_to_string(&tinymce_vue).unwrap();
    println!("原始内容:\n{}", original_content);
    println!("修改后内容:\n{}", new_content);

    // 关键断言：import 路径应该被替换为 @ 别名，并且补全了 .vue 后缀
    assert!(
        new_content.contains("@/components/editorImage.vue"),
        "文件内容应该包含 '@/components/editorImage.vue'，但实际内容:\n{}",
        new_content
    );
    assert!(
        !new_content.contains("../components/editorImage'"),
        "文件内容不应该再包含 '../components/editorImage'，但实际内容:\n{}",
        new_content
    );
}

/// 端到端测试：同级目录无后缀 import（用户截图场景）
#[test]
fn test_write_to_file_sync_sibling_dir_no_suffix() {
    use agmd::change_path::change_path_sync;
    use agmd::types::FileNode;

    let temp_dir = TempDir::new().unwrap();
    let root = temp_dir.path();

    // 创建目录结构：src/components/TinyMce.vue 和 src/components/editorImage.vue
    let src_dir = root.join("src");
    fs::create_dir(&src_dir).unwrap();
    let components_dir = src_dir.join("components");
    fs::create_dir(&components_dir).unwrap();

    // 创建 TinyMce.vue，包含同级目录无后缀的 import
    let tinymce_vue = components_dir.join("TinyMce.vue");
    let original_content = "<script>\nimport editorImage from './editorImage'\n\nexport default {\n  name: 'tinymce',\n}\n</script>\n";
    fs::write(&tinymce_vue, original_content).unwrap();

    // 创建 editorImage.vue
    let editor_image_vue = components_dir.join("editorImage.vue");
    fs::write(&editor_image_vue, "<template><div>Image Editor</div></template>\n").unwrap();

    // 创建 package.json（空依赖）
    fs::write(root.join("package.json"), "{}").unwrap();

    // 创建 FileNode
    let mut nodes = vec![FileNode {
        name: "TinyMce.vue".to_string(),
        copyed: None,
        is_dir: false,
        level: 0,
        note: String::new(),
        size: None,
        suffix: None,
        row_size: None,
        full_path: tinymce_vue.to_string_lossy().to_string(),
        belong_to: vec![],
        imports: vec![],
        children: None,
    }];

    // 执行 change_path_sync（to_absolute_alias = true）
    let result = change_path_sync(&mut nodes, root, false, true, false);
    assert!(result.is_ok());

    // 读取修改后的文件内容
    let new_content = fs::read_to_string(&tinymce_vue).unwrap();
    println!("原始内容:\n{}", original_content);
    println!("修改后内容:\n{}", new_content);

    // 关键断言：import 路径应该被替换为 @ 别名，并且补全了 .vue 后缀
    assert!(
        new_content.contains("@/components/editorImage.vue"),
        "文件内容应该包含 '@/components/editorImage.vue'，但实际内容:\n{}",
        new_content
    );
    assert!(
        !new_content.contains("./editorImage'"),
        "文件内容不应该再包含 './editorImage'，但实际内容:\n{}",
        new_content
    );
}

/// 端到端测试：模拟 change_absolute_path_action 的两次调用
#[test]
fn test_change_absolute_path_action_two_passes() {
    use agmd::change_path::change_path_sync;
    use agmd::types::FileNode;

    let temp_dir = TempDir::new().unwrap();
    let root = temp_dir.path();

    // 创建目录结构
    let src_dir = root.join("src");
    fs::create_dir(&src_dir).unwrap();
    let components_dir = src_dir.join("components");
    fs::create_dir(&components_dir).unwrap();

    // 创建 TinyMce.vue，包含无后缀的 import
    let tinymce_vue = components_dir.join("TinyMce.vue");
    let original_content = "<script>\nimport editorImage from './editorImage'\n\nexport default {\n  name: 'tinymce',\n}\n</script>\n";
    fs::write(&tinymce_vue, original_content).unwrap();

    // 创建 editorImage.vue
    let editor_image_vue = components_dir.join("editorImage.vue");
    fs::write(&editor_image_vue, "<template><div>Image Editor</div></template>\n").unwrap();

    // 创建 package.json（空依赖）
    fs::write(root.join("package.json"), "{}").unwrap();

    // 创建 FileNode
    let mut nodes = vec![FileNode {
        name: "TinyMce.vue".to_string(),
        copyed: None,
        is_dir: false,
        level: 0,
        note: String::new(),
        size: None,
        suffix: None,
        row_size: None,
        full_path: tinymce_vue.to_string_lossy().to_string(),
        belong_to: vec![],
        imports: vec![],
        children: None,
    }];

    // 第一次调用：no_change_path=false, to_absolute_alias=false（转为相对路径）
    let result = change_path_sync(&mut nodes, root, false, false, false);
    assert!(result.is_ok());

    // 读取第一次修改后的内容
    let after_relative = fs::read_to_string(&tinymce_vue).unwrap();
    println!("第一次调用后（相对路径）:\n{}", after_relative);

    // 第二次调用：no_change_path=false, to_absolute_alias=true（转为 @ 别名）
    let result = change_path_sync(&mut nodes, root, false, true, false);
    assert!(result.is_ok());

    // 读取第二次修改后的内容
    let after_alias = fs::read_to_string(&tinymce_vue).unwrap();
    println!("第二次调用后（@ 别名）:\n{}", after_alias);

    // 关键断言：最终应该是 @ 别名路径
    assert!(
        after_alias.contains("@/components/editorImage.vue"),
        "最终内容应该包含 '@/components/editorImage.vue'，但实际内容:\n{}",
        after_alias
    );
}

/// 端到端测试：深层目录无后缀 import 转换为 @ 别名
#[test]
fn test_deep_dir_no_suffix_to_alias() {
    use agmd::change_path::change_path_sync;
    use agmd::types::FileNode;

    let temp_dir = TempDir::new().unwrap();
    let root = temp_dir.path();

    // 创建深层目录结构
    let src_dir = root.join("src");
    fs::create_dir(&src_dir).unwrap();
    let views_dir = src_dir.join("views");
    fs::create_dir(&views_dir).unwrap();
    let video_dir = views_dir.join("videoSurveillance");
    fs::create_dir(&video_dir).unwrap();
    let monitoring_dir = video_dir.join("monitoringOverview");
    fs::create_dir(&monitoring_dir).unwrap();
    let component_dir = monitoring_dir.join("component");
    fs::create_dir(&component_dir).unwrap();

    // 创建 Page.vue，包含无后缀的 import
    let page_vue = component_dir.join("Page.vue");
    let original_content = "<script>\nimport mixin from './mixin'\n\nexport default {\n  name: 'page',\n}\n</script>\n";
    fs::write(&page_vue, original_content).unwrap();

    // 创建 mixin.js
    let mixin_js = component_dir.join("mixin.js");
    fs::write(&mixin_js, "export default {\n  methods: {}\n}\n").unwrap();

    // 创建 package.json（空依赖）
    fs::write(root.join("package.json"), "{}").unwrap();

    // 创建 FileNode
    let mut nodes = vec![FileNode {
        name: "Page.vue".to_string(),
        copyed: None,
        is_dir: false,
        level: 0,
        note: String::new(),
        size: None,
        suffix: None,
        row_size: None,
        full_path: page_vue.to_string_lossy().to_string(),
        belong_to: vec![],
        imports: vec![],
        children: None,
    }];

    // 执行 change_path_sync（to_absolute_alias = true）
    let result = change_path_sync(&mut nodes, root, false, true, false);
    assert!(result.is_ok());

    // 读取修改后的文件内容
    let new_content = fs::read_to_string(&page_vue).unwrap();
    println!("原始内容:\n{}", original_content);
    println!("修改后内容:\n{}", new_content);

    // 关键断言：import 路径应该被替换为 @ 别名，并且补全了 .js 后缀
    assert!(
        new_content.contains("@/views/videoSurveillance/monitoringOverview/component/mixin.js"),
        "文件内容应该包含 '@/views/videoSurveillance/monitoringOverview/component/mixin.js'，但实际内容:\n{}",
        new_content
    );
    assert!(
        !new_content.contains("./mixin'"),
        "文件内容不应该再包含 './mixin'，但实际内容:\n{}",
        new_content
    );
}

/// 端到端测试：模拟用户截图场景（TinyMce/index.vue 引用 ./components/editorImage）
#[test]
fn test_user_screenshot_scenario() {
    use agmd::change_path::change_path_sync;
    use agmd::types::FileNode;

    let temp_dir = TempDir::new().unwrap();
    let root = temp_dir.path();

    // 创建目录结构：src/components/TinyMce/index.vue 和 src/components/TinyMce/components/editorImage.vue
    let src_dir = root.join("src");
    fs::create_dir(&src_dir).unwrap();
    let components_dir = src_dir.join("components");
    fs::create_dir(&components_dir).unwrap();
    let tinymce_dir = components_dir.join("TinyMce");
    fs::create_dir(&tinymce_dir).unwrap();
    let tinymce_components_dir = tinymce_dir.join("components");
    fs::create_dir(&tinymce_components_dir).unwrap();

    // 创建 index.vue，包含无后缀的 import
    let index_vue = tinymce_dir.join("index.vue");
    let original_content = "<script>\nimport editorImage from './components/editorImage'\n\nexport default {\n  name: 'tinymce',\n}\n</script>\n";
    fs::write(&index_vue, original_content).unwrap();

    // 创建 editorImage.vue
    let editor_image_vue = tinymce_components_dir.join("editorImage.vue");
    fs::write(&editor_image_vue, "<template><div>Image Editor</div></template>\n").unwrap();

    // 创建 package.json（空依赖）
    fs::write(root.join("package.json"), "{}").unwrap();

    // 创建 FileNode
    let mut nodes = vec![FileNode {
        name: "index.vue".to_string(),
        copyed: None,
        is_dir: false,
        level: 0,
        note: String::new(),
        size: None,
        suffix: None,
        row_size: None,
        full_path: index_vue.to_string_lossy().to_string(),
        belong_to: vec![],
        imports: vec![],
        children: None,
    }];

    // 执行 change_path_sync（to_absolute_alias = true）
    let result = change_path_sync(&mut nodes, root, false, true, false);
    assert!(result.is_ok());

    // 读取修改后的文件内容
    let new_content = fs::read_to_string(&index_vue).unwrap();
    println!("原始内容:\n{}", original_content);
    println!("修改后内容:\n{}", new_content);

    // 关键断言：import 路径应该被替换为 @ 别名，并且补全了 .vue 后缀
    assert!(
        new_content.contains("@/components/TinyMce/components/editorImage.vue"),
        "文件内容应该包含 '@/components/TinyMce/components/editorImage.vue'，但实际内容:\n{}",
        new_content
    );
    assert!(
        !new_content.contains("./components/editorImage'"),
        "文件内容不应该再包含 './components/editorImage'，但实际内容:\n{}",
        new_content
    );
}

/// 端到端测试：模拟 change_absolute_path_action 的两步调用（用户截图场景）
#[test]
fn test_user_screenshot_two_passes() {
    use agmd::change_path::change_path_sync;
    use agmd::types::FileNode;

    let temp_dir = TempDir::new().unwrap();
    let root = temp_dir.path();

    // 创建目录结构
    let src_dir = root.join("src");
    fs::create_dir(&src_dir).unwrap();
    let components_dir = src_dir.join("components");
    fs::create_dir(&components_dir).unwrap();
    let tinymce_dir = components_dir.join("TinyMce");
    fs::create_dir(&tinymce_dir).unwrap();
    let tinymce_components_dir = tinymce_dir.join("components");
    fs::create_dir(&tinymce_components_dir).unwrap();

    // 创建 index.vue
    let index_vue = tinymce_dir.join("index.vue");
    let original_content = "<script>\nimport editorImage from './components/editorImage'\n\nexport default {\n  name: 'tinymce',\n}\n</script>\n";
    fs::write(&index_vue, original_content).unwrap();

    // 创建 editorImage.vue
    let editor_image_vue = tinymce_components_dir.join("editorImage.vue");
    fs::write(&editor_image_vue, "<template><div>Image Editor</div></template>\n").unwrap();

    // 创建 package.json
    fs::write(root.join("package.json"), "{}").unwrap();

    // 创建 FileNode
    let mut nodes = vec![FileNode {
        name: "index.vue".to_string(),
        copyed: None,
        is_dir: false,
        level: 0,
        note: String::new(),
        size: None,
        suffix: None,
        row_size: None,
        full_path: index_vue.to_string_lossy().to_string(),
        belong_to: vec![],
        imports: vec![],
        children: None,
    }];

    // 第一次调用：转为相对路径（带后缀）
    let result = change_path_sync(&mut nodes, root, false, false, false);
    assert!(result.is_ok());
    let after_relative = fs::read_to_string(&index_vue).unwrap();
    println!("第一次调用后（相对路径）:\n{}", after_relative);

    // 第二次调用：转为 @ 别名
    let result = change_path_sync(&mut nodes, root, false, true, false);
    assert!(result.is_ok());
    let after_alias = fs::read_to_string(&index_vue).unwrap();
    println!("第二次调用后（@ 别名）:\n{}", after_alias);

    // 关键断言
    assert!(
        after_alias.contains("@/components/TinyMce/components/editorImage.vue"),
        "最终内容应该包含 '@/components/TinyMce/components/editorImage.vue'，但实际内容:\n{}",
        after_alias
    );
}
