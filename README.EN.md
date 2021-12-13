# agmd(auto generate md)



>Enter 'AGMD' in any folder where documents need to be generated, and the directory MD description can be automatically generated



[![]( https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667 )]( https://camo.githubusercontent.com/28479a7a834310a667f36760a27283f7389e864a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f76322d646174657069636b65722e737667 )



English| [中文](https://github.com/majun2232/vue3sketchRuler/blob/master/README.md)  



### Case



! [image]( https://github.com/majun2232/auto-generate-md/blob/master/md.png )



### Method of use



Global installation (Global installation is required, otherwise it will be reported that the "AGMD" item cannot be recognized as the name of cmdlet, function, script file or runnable program)



> npm i agmd -g



After installation, enter 'AGMD' under the folder where MD needs to be recorded, and the names of folders and files under the relative path will be automatically generated. If comments are written in the header of the file, it will be brought together to automatically generate MD files. The generated file name is' readme md.md ', and the path is the path just entered. At the same level, for the development of large projects, this script may save you some time.



Example is some of the files I prepared for the demonstration, which is of no other use



### Creative background



1. Have you been asked to write a MD description of the directory file?

2. Or if the project directory and files have been relocated and reconstructed, the directory description in the MD file needs to be modified again

3. After taking over the old project and reading the MD instructions, you can see the file functions in the folder at a glance instead of clicking on the corresponding file

4. You need to take notes to analyze the source code project



### Function



1. Automatically generate folder names and files matching directories (sorted by name)

2. Automatically determine the hierarchical directory and indent it

3. If there is a comment at the top of the file, it will be judged automatically

4. Support recursive search of subordinate files in any file directory (do not execute in a large directory!!! Recursion until there are no files in this directory)

5. Current support record js . vue . Ts and folders, of course, also support others. I've written so much about this version. You can mention PR if you need it later





### Related articles

[Nuggets - auto generate directory MD file](https://juejin.cn/post/7030030599268073508)  