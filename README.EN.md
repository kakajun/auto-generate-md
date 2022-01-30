# agmd(auto generate md)



>For any document that needs to be generated, enter 'AGMD' in the console under the folder to automatically generate the directory MD description



[![]( https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667 )]( https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667 )


🚀 Features

🔥 Written in TypeScript

🔋 build with esbuild

💡 easy get foldName and fileName.



### Case



! [image]( https://github.com/kakajun/auto-generate-md/blob/master/md2.png )



### Method of use

Node environment is required

1. Global installation

> npm i agmd -g



After installation, enter 'AGMD' under the folder where MD needs to be recorded, and the names of folders and files under the relative path will be automatically generated. If comments are written in the header of the file, it will be brought together to automatically generate MD files. The generated file name is' readme md.md ', and the path is the path just entered. At the same level, for the development of large projects, this script may save you some time.



2. Install as a dependency

> npm i agmd -D



In package Configure AGMD in scripts of JSON: NPX AGMD -- ignore lib, node_ modules,dist --include . js,. ts,. Vue can automatically update the document with the command line every time it is started or packaged




Example is some of the files I prepared for the demonstration, which is of no other use



3. Advanced usage

Some need to insert the automatically generated documents into an automatically generated MD. the plug-in exports the automatically generated MD data method, and 'getfilenodes' obtains the specific information of all files. You can DIY different documents (the method name does not need to be remembered, because it is written by TS, so it will be automatically clicked)

>const agmd = require('agmd')



In es:

>import agmd from 'agmd'



- AGMD Getfilenodes () can obtain information related to specific files, and this function can pass a parameter



- agmd. Getmd() gets the final output information

Note: the above two methods can pass an option input parameter in the following format:

option: { ignore: string[] | undefined; include: string[] | undefined }

#### Command line parameter description

1. Use AGMD - h to view help

2. You can bring -- ignore to ignore the output file or folder. The default is: IMG, styles, node_ modules,LICENSE,. git,. github,dist,. husky,. vscode,readme-file. js,readme-md.js

3. You can bring -- include. Only files with this suffix are required to be output. By default, only files are output js,. vue,. TS, you can add JSX, JSON, etc



### Creative background

1. Have you been asked to write a MD description of the directory file?

2. Or if the project directory and files are reconstructed after being moved, the directory description in the MD file needs to be modified again

3. After taking over the old project and reading the MD instructions, you can see the file functions in the folder at a glance, rather than clicking on the corresponding file

4. You need to take notes to analyze the source code project



### Function

1. Automatically generate folder names and files matching directories (sorted by name)

2. Automatically determine the hierarchical directory and indent it

3. If there is a comment at the top of the file, it will be judged automatically

4. Support recursive search of subordinate files in any file directory (do not execute in a large directory!!! Recursion until there are no files in this directory)

5. Support command line parameter configuration, and can customize ignore files and filter suffix files

6. Command line parsing



`Usage: agmd--include str--ignore str



Options:

--include string / -i string.......... include file extension

--ignore string / -in string........... ignore file or fold



Str deafult:

--ignore / -i img,styles,node_ modules,LICENSE,. git,. github,dist,. husky,. vscode,readme-file. js,readme-md.js

--include / -in . js,. vue,. ts



Note:

There should be no space between strings in a configuration



Examples:

$ agmd --ignore lib,node_ modules,dist --include . js,. ts,. vue`



### Related articles

[Nuggets - auto generate directory MD file]（ https://juejin.cn/post/7030030599268073508 )



### Update record

0.1.3

1. Package with esbuild

2. It is written in eslint and preter specification

3. Rewrite with TS

4. Support gitee one key synchronization test11253123



0.2.0

Support command-line parsing parameters, and can transfer parameters dynamically
