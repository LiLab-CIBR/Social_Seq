#
这个项目包含main分支和 gh-pages分支，gh-pages分支用于发布文档，main分支用于开发。
main 分支的 docs/ 目录用于存放markdown格式的文档，用于 gh-pages分支。
使用 `mkdocs gh-deploy` 命令将 docs/ 目录中的markdown文件编译成html文件，并发布到 gh-pages分支。
使用 `git push origin gh-pages` 命令将编译后的html文件推送到 gh-pages分支。
等待github/action 编译完成后，就可以在 https://lilab-cibr.github.io/Social_Seq/ 访问文档了。