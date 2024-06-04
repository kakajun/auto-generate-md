# Auto-Generate-MD (agmd)

> Auto-Generate-MD is a versatile tool designed to enhance front-end code management. Perfect for developers and teams looking to streamline their documentation process, it offers a range of features from automatic markdown generation to detailed project analysis.

[![]( https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)]( https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667)
[![]( https://github.com/kakajun/auto-generate-md/actions/workflows/test.yml/badge.svg?branch=master)]( https://github.com/kakajun/auto-generate-md/actions/workflows/test.yml)
[![]( https://app.circleci.com/pipelines/github/kakajun/auto-generate-md)]( https://app.circleci.com/pipelines/github/kakajun/auto-generate-md)

简体中文 | [English](https://github.com/kakajun/auto-generate-md/blob/master/README.EN.md)

 ## 🚀 Features


*   **Automatic Markdown Generation**: Enter `agmd` in any directory to create a markdown file summarizing its contents.
*   **Code and File Analysis**: Provides statistics on code volume and file types within your project.
*   **Path Conversion**: Converts absolute paths to relative for easier file navigation in VS Code.
*   **Route Marking**: Classifies the project based on routes, aiding in project segmentation.
*   **Interface-Friendly**: Offers a GUI for command operations, eliminating the need to memorize commands.
*   **Comprehensive Structure Tree**: Generates a JSON tree representing the entire project structure.
*   **TypeScript Support**: Written in TypeScript with 85% of the code covered by test cases.

### Interface Preview

![image](https://github.com/kakajun/auto-generate-md/blob/master/md3.png)
### Use Cases

![image](https://github.com/kakajun/auto-generate-md/blob/master/md2.png)

### Installation and Usage
1.  **Global Installation**:

    *   Install globally using `npm i agmd -g`.
    *   Run `agmd` in the desired directory to generate markdown files.
2.  **Dependency Installation**:

    *   Install as a dev dependency with `npm i agmd -D`.
    *   Configure in `package.json` for automatic documentation updates.


###  Command Descriptions
*   Help
*   Generate structure tree document
*   Convert to relative paths
*   Complete file suffix
*   Rename files and folders to KebabCase
*   Mark and categorize files

 ### Advanced Use

*   Classify files using `classify.js` in the src directory.
*   Access `getFileNodes()` and `getMd()` for custom documentation.

#### Command Line Arguments
*   `agmd -h` for help.
*   `--ignore` to exclude files or folders.
*   `--include` to specify file types for inclusion.

 ### Development and Contribution
This project includes 26 tests for easy expansion and modification. Contributions and PRs are welcome.


### Changelog
*   **0.3.15**: Code refactoring and updates.
*   **0.3.8**: Interface improvements and feature additions.
*   **0.3.0**: Major feature updates and UI improvements.
*   **0.2.9**: File statistic feature added.
*   **0.2.6**: Global installation bug fix.
*   **0.2.0**: Support for command-line argument parsing.
*   **0.1.3**: Initial release with basic features.

### Related Articles
[掘金-自动生成目录 md 文件](https://juejin.cn/post/7030030599268073508)
