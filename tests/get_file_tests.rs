use agmd::get_file::{resolve_alias_path, get_relative_path};
use agmd::utils::get_import_name;
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
