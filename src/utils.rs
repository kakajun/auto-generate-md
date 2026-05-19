use regex::Regex;
use std::path::Path;

lazy_static::lazy_static! {
    static ref ROUTER_PATH_RE: Regex = Regex::new(r#"path:\s*['"]([^'"]+)['"]"#).unwrap();
    static ref COMPONENT_PATH_RE: Regex = Regex::new(r#"component:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)"#).unwrap();
    static ref IMPORT_RE: Regex = Regex::new(r#"from\s+["']([^"']+)["']"#).unwrap();
}

/// 解析路由文件中的路由路径
pub fn parse_router_path(line: &str) -> Option<String> {
    ROUTER_PATH_RE.captures(line).map(|cap| cap[1].to_string())
}

/// 解析路由文件中的组件路径
pub fn parse_component_path(line: &str) -> Option<String> {
    COMPONENT_PATH_RE.captures(line).map(|cap| cap[1].to_string())
}

/// 从 package.json 获取依赖列表
pub fn get_dependencies(package_json_path: &Path) -> Vec<String> {
    let mut deps = Vec::new();
    if let Ok(content) = std::fs::read_to_string(package_json_path) {
        if let Ok(pkg) = serde_json::from_str::<serde_json::Value>(&content) {
            if let Some(dependencies) = pkg.get("dependencies").and_then(|d| d.as_object()) {
                for key in dependencies.keys() {
                    deps.push(key.clone());
                }
            }
            if let Some(dev_dependencies) = pkg.get("devDependencies").and_then(|d| d.as_object()) {
                for key in dev_dependencies.keys() {
                    deps.push(key.clone());
                }
            }
        }
    }
    deps
}

/// 检查当前目录是否为项目根目录（存在 package.json）
pub fn is_root_directory() -> bool {
    Path::new("package.json").exists()
}

/// 格式化数字为千分位
pub fn format_number(num: usize) -> String {
    let s = num.to_string();
    let mut result = String::new();
    let mut count = 0;
    for ch in s.chars().rev() {
        if count > 0 && count % 3 == 0 {
            result.push(',');
        }
        result.push(ch);
        count += 1;
    }
    result.chars().rev().collect()
}

/// 将字符串转为 kebab-case
pub fn to_kebab_case(s: &str) -> String {
    let mut result = String::new();
    let mut prev_upper = false;
    for (i, ch) in s.chars().enumerate() {
        if ch.is_uppercase() {
            if i > 0 && !prev_upper {
                result.push('-');
            }
            result.push(ch.to_lowercase().next().unwrap());
            prev_upper = true;
        } else {
            result.push(ch);
            prev_upper = false;
        }
    }
    // 首字母小写
    if let Some(first) = result.chars().next() {
        let mut final_result = first.to_lowercase().to_string();
        final_result.push_str(&result[first.len_utf8()..]);
        final_result
    } else {
        result
    }
}

/// 将字符串转为 CamelCase (PascalCase)
pub fn to_camel_case(s: &str) -> String {
    let mut result = String::new();
    let mut capitalize_next = true;
    for ch in s.chars() {
        if ch == '-' || ch == '_' {
            capitalize_next = true;
        } else if capitalize_next {
            result.push(ch.to_uppercase().next().unwrap());
            capitalize_next = false;
        } else {
            result.push(ch);
        }
    }
    result
}

/// 检测文件名是否包含驼峰
pub fn check_camel_file(file_name: &str) -> bool {
    let re = Regex::new(r"([a-z])([A-Z])|([A-Z])").unwrap();
    re.is_match(file_name)
}

/// 检测文件名是否包含大写字母
pub fn check_upper_camel_file(file_name: &str) -> bool {
    file_name.chars().any(|c| c.is_uppercase())
}

/// 获取 import 名称
pub fn get_import_name(line: &str, dependencies: &[String]) -> Option<String> {
    let is_dep = dependencies.iter().any(|dep| line.contains(dep));
    // 排除插件依赖、无斜杠的路径（如 'vue'）、注释行
    if is_dep || !line.contains('/') || line.starts_with("//") {
        return None;
    }
    let result = IMPORT_RE.captures(line).map(|cap| cap[1].to_string());
    // 排除已经是绝对路径的情况（以 // 开头，如 //?/E:/...）
    // 同时排除包含 # 或其他非路径符号的路径
    if let Some(ref path) = result {
        if path.starts_with("//") || path.contains('#') || path.contains(' ') {
            return None;
        }
    }
    result
}

/// 默认忽略列表
pub fn default_ignore() -> Vec<String> {
    vec![
        "es6".to_string(),
        "lib".to_string(),
        "jest.config.js".to_string(),
        "router".to_string(),
        "img".to_string(),
        "styles".to_string(),
        "node_modules".to_string(),
        "LICENSE".to_string(),
        ".git".to_string(),
        ".github".to_string(),
        "dist".to_string(),
        ".husky".to_string(),
        ".vscode".to_string(),
        ".eslintrc.js".to_string(),
        "readme-file.js".to_string(),
        "readme-md.js".to_string(),
    ]
}

/// 默认包含后缀列表
pub fn default_include() -> Vec<String> {
    vec![
        ".js".to_string(),
        ".vue".to_string(),
        ".ts".to_string(),
        ".tsx".to_string(),
    ]
}
