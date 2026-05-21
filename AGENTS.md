# AGENTS.md — agmd (auto-generate-md)

> 本文件面向 AI 编程助手。若你对本项目一无所知，请先阅读本文档再修改代码。

---

## 项目概述

`agmd` 是一个用 **Rust** 编写的 CLI 工具兼库，用于扫描前端工程目录并自动生成 Markdown 文档、统计代码量、规范化 import 路径、批量重命名文件/文件夹，以及按路由对工程文件进行标记和拆分。

- **包名**: `agmd`
- **版本**: `0.4.0` (Rust crate) / `1.0.0` (npm 包)
- **协议**: MIT
- **仓库**: https://github.com/kakajun/auto-generate-md

> ⚠️ 当前 `Cargo.toml` (`0.4.0`) 与 `package.json` (`1.0.0`) 版本号不一致，发布前务必同步。

本项目同时提供：
1. **Rust 二进制** (`cargo run --bin agmd`) —— 独立可执行文件，零 Node.js 依赖。
2. **Rust 库** (`src/lib.rs`) —— 暴露异步 API `get_file_nodes_api` 和 `get_md_api`。
3. **npm 包** (根目录 `package.json`) —— 内含多平台预编译二进制，安装时自动匹配当前平台。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 语言 | Rust (Edition 2024) |
| 异步运行时 | Tokio (`features = ["full"]`) |
| CLI 解析 | clap (derive 宏) |
| 交互菜单 | dialoguer + console |
| 序列化 | serde + serde_json |
| 正则 | regex |
| 文件遍历 | walkdir |
| 路径差分 | pathdiff |
| 命名转换 | convert_case |
| 测试辅助 | tempfile (dev-dependency) |
| 分发 | npm 包包裹预编译二进制 |

---

## 项目结构

```
├── src/
│   ├── main.rs              # 二进制入口：解析 CLI 参数 + 交互菜单
│   ├── lib.rs               # 库入口：公开模块 + 两个公开 API
│   ├── cli.rs               # clap 派生的 Args 结构体和帮助文本
│   ├── types.rs             # 核心数据结构：FileNode, Options, Router, RouterItem, CountResult, RenameInfo
│   ├── commands.rs          # 高层动作分发器（对应菜单每一项）
│   ├── utils.rs             # 工具函数：正则解析、命名转换、默认忽略/包含列表
│   ├── get_file.rs          # 递归扫描文件系统、提取注释/大小/行数/import
│   ├── write_md.rs          # 生成 Markdown、统计输出、codeAndPrompt.md
│   ├── change_path.rs       # 批量重写 import 路径（相对 ↔ @ 别名）
│   ├── rename_path.rs       # 批量重命名文件/文件夹（kebab-case ↔ CamelCase）
│   ├── get_router.rs        # 解析 router 配置或 classify.js
│   ├── mark_file.rs         # 按路由给文件打标记（//markname）
│   ├── mark_write_file.rs   # 按标记分类复制文件到路由目录
│   └── bin/                 # 开发调试用的独立可执行脚本（硬编码本地路径）
├── tests/                   # 集成测试与单元测试
│   ├── integration_test.rs
│   ├── get_file_tests.rs
│   ├── router_tests.rs
│   ├── utils_tests.rs
│   ├── write_md_tests.rs
│   └── rename_path_tests.rs
├── bin/                     # 预编译二进制存放目录（多平台分发）
├── imgs/                    # 文档图片（README 引用）
├── Cargo.toml               # Rust 包配置
├── package.json             # npm 包配置（含 files、scripts、bin）
├── agmd.js                  # Node 入口：检测平台并 spawn 二进制
├── install.js               # postinstall：复制对应平台二进制到 agmd / agmd.exe
├── .cargo/config.toml       # 交叉编译链接器配置
├── .github/workflows/test.yml # CI（Rust 原生测试）
├── classify.js              # 路由分类配置示例（@/ 别名路径）
├── README.md                # 中文文档（主文档）
└── README.EN.md             # 英文文档
```

---

## 构建与测试命令

### 日常开发

```bash
# 编译调试版本
cargo build

# 编译 release 版本
cargo build --release

# 运行所有测试（36+ 个）
cargo test

# 运行单个测试并打印输出
cargo test <测试名> -- --nocapture

# 直接运行 CLI
cargo run --bin agmd
```

### 交叉编译 / 发布

项目支持多平台二进制分发。参考 `.cargo/config.toml` 中已配置的交叉编译目标：

- `aarch64-unknown-linux-gnu`
- `x86_64-pc-windows-gnu`

完整发布流程见 `README.md` 中「开发者打包发布说明」一节。发布前必须同步以下文件的版本号：
- `Cargo.toml`
- `package.json`

编译后将二进制复制到 `bin/` 并执行 `npm publish`。

### npm 脚本

```bash
npm run build    # => cargo build --release
npm run test     # => cargo test
```

---

## 代码组织与模块划分

### 核心流程

1. **扫描** (`get_file.rs`) —— 递归读取目录，构建 `FileNode` 树，提取文件元数据（大小、行数、首行注释、import 语句）。
2. **输出** (`write_md.rs`) —— 将 `FileNode` 树渲染为 Markdown，或输出 `codeAndPrompt.md`（目录树 + 完整源码）。
3. **路径操作** (`change_path.rs`) —— 根据 `FileNode` 中的 `imports`，批量替换文件内的 `from '...'` 路径：支持「相对路径 → `@` 别名」和「`@` 别名 → 相对路径」两种方向，以及仅补全后缀的模式。
4. **重命名** (`rename_path.rs`) —— 对文件/文件夹在 `kebab-case` 与 `CamelCase`/`UpperCamelCase` 之间批量转换，并同步更新文件内的 import 路径。Windows 下对大小写不敏感文件系统采用“先临时重命名再最终重命名”的策略。
5. **路由与标记** (`get_router.rs` → `mark_file.rs` → `mark_write_file.rs`) —— 解析路由配置，沿组件依赖链注入标记注释，最后按路由将文件复制到独立目录。

### 数据结构中心

所有跨模块传递的数据结构定义在 `src/types.rs`：
- `Options` —— 扫描/操作的全局选项（ignore, include, dry_run, silent）。
- `FileNode` —— 文件/目录树节点，含子节点、import 列表、所属路由等。
- `Router` / `RouterItem` —— 路由配置结构。
- `CountResult` —— 统计结果（总行数、总字符数、按后缀计数）。
- `RenameInfo` —— 重命名前后名称映射。

### 交互入口

`main.rs` 使用 `dialoguer::Select` 提供中文交互菜单，共 14 个选项，对应 `commands.rs` 中的动作函数。

---

## 代码风格规范

1. **注释语言**：代码注释和文档字符串以 **中文** 为主。新增注释请保持中文。
2. **错误处理**：统一使用 `anyhow::Result` 进行错误传播，顶层 `main` 函数直接返回 `Result`。
3. **异步**：IO 密集型操作使用 `tokio` 异步 API（如 `tokio::fs`），公开 API 均为 `async fn`。
4. **命名**：
   - 模块/函数：蛇形命名（`get_file_nodes`, `change_path_sync`）。
   - 结构体：大驼峰（`FileNode`, `Options`）。
   - 布尔标志字段：以动词或状态命名（`dry_run`, `is_dir`, `copyed`）。
5. **序列化**：对外暴露的数据结构使用 `serde` 的 `Serialize`/`Deserialize` derive，可选字段配合 `skip_serializing_if = "Option::is_none"`。
6. **不安全代码**：仅在 `mark_file.rs` 和 `mark_write_file.rs` 中使用 `unsafe` 指针技巧实现可变树遍历（`find_nodes_mut`）。修改此类代码需格外谨慎。
7. **字符串处理**：路径和文本处理大量使用 `regex` 进行解析（如 `parse_router_path`, `parse_component_path`）。

---

## 测试策略

测试全部位于 `tests/` 目录，按功能分文件：

| 测试文件 | 覆盖内容 |
|----------|----------|
| `integration_test.rs` | 端到端集成测试：临时目录构造真实文件，测试扫描、路径替换、后缀补全、两遍绝对路径操作等 |
| `get_file_tests.rs` | `resolve_alias_path`, `get_relative_path`, `change_import`, `set_md`, `get_note` |
| `router_tests.rs` | `parse_router_path`, `parse_component_path` 的正则解析 |
| `utils_tests.rs` | 命名转换、数字格式化、默认列表等工具函数 |
| `write_md_tests.rs` | `get_count_md`, `set_count_md` 统计与 Markdown 格式化 |
| `rename_path_tests.rs` | 路径转换、真实文件系统重命名（含嵌套目录和 Windows 大小写处理）|

### 运行建议

```bash
# 全量测试
cargo test

# 查看测试覆盖率（若已安装 cargo-tarpaulin）
cargo tarpaulin --out Html
```

### 新增功能的测试约定

- 凡涉及文件系统写入的操作，优先使用 `tempfile::TempDir` 构造隔离环境。
- `dry_run` 模式应在测试中被覆盖，确保不会实际修改文件系统。
- 涉及 import 路径替换的测试需覆盖：同级目录、兄弟目录、深层目录、`@` 别名互转、仅补全后缀等场景。

---

## 安全与注意事项

1. **文件系统写入**：`dry_run` 模式仅用于预览，但代码中仍有多处直接 `fs::write` / `rename`。修改路径操作相关代码时，务必检查 `dry_run` 和 `silent` 标志是否正确传递。
2. **Windows 大小写敏感**：`rename_path.rs` 对 Windows 文件系统做了特殊处理（临时重命名策略）。改动重命名逻辑时应在 Windows 环境验证。
3. **npm 分发安全**：`bin/` 中的预编译二进制按惯例不纳入 Git 跟踪（`.gitignore` 已排除）。发布时需手动将可信构建产物放入该目录。
4. **classify.js 路径格式**：路由分类功能要求配置中使用 `@/` 开头的别名路径。若扩展路由解析逻辑，需保持对该约定的兼容。
5. **开发调试脚本**：`src/bin/` 下的多个测试二进制硬编码了本地路径（如 `E:\cwd\front1.5`）。这些文件仅供原作者本地调试，不应作为通用入口依赖。

---

## 快速参考

| 目标 | 命令 |
|------|------|
| 本地运行 CLI | `cargo run --bin agmd` |
| 运行全部测试 | `cargo test` |
| Release 构建 | `cargo build --release` |
| 构建 Windows GNU 目标 | `cargo build --release --target x86_64-pc-windows-gnu` |
| 发布 npm 包 | 同步版本号后 `npm publish` |
