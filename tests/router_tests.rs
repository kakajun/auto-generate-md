use agmd::utils::{parse_router_path, parse_component_path};

#[test]
fn test_parse_router_path_variations() {
    // 单引号
    assert_eq!(
        parse_router_path(r#"path: '/user/list'"#),
        Some("/user/list".to_string())
    );
    // 双引号
    assert_eq!(
        parse_router_path(r#"path: "/home""#),
        Some("/home".to_string())
    );
    // 带空格
    assert_eq!(
        parse_router_path(r#"path:   '/about'"#),
        Some("/about".to_string())
    );
    // 不匹配
    assert_eq!(parse_router_path("const path = '/x'"), None);
    assert_eq!(parse_router_path(""), None);
}

#[test]
fn test_parse_component_path_variations() {
    // 标准格式
    assert_eq!(
        parse_component_path(r#"component: () => import('@/views/Home.vue')"#),
        Some("@/views/Home.vue".to_string())
    );
    // 无空格
    assert_eq!(
        parse_component_path(r#"component:()=>import("@/views/User.vue")"#),
        Some("@/views/User.vue".to_string())
    );
    // 不匹配
    assert_eq!(parse_component_path("const c = 1"), None);
    assert_eq!(parse_component_path(""), None);
}
