use std::path::Path;
use std::fs;

fn scan_dir(dir: &Path, depth: usize) {
    let entries = fs::read_dir(dir).unwrap();
    let mut dirs = Vec::new();
    for entry in entries {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.is_dir() {
            dirs.push(path);
        }
    }
    dirs.sort();
    for d in dirs {
        let name = d.file_name().unwrap().to_string_lossy();
        let has_upper = name.chars().any(|c| c.is_uppercase());
        let indent = "  ".repeat(depth);
        if has_upper {
            println!("{}{}/ [NEED RENAME]", indent, name);
        } else {
            println!("{}{}/", indent, name);
        }
        scan_dir(&d, depth + 1);
    }
}

fn main() {
    let root = Path::new(r"E:\cwd\front1.5\src\views\dataBoard");
    scan_dir(root, 0);
}
