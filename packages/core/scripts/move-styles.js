import shell from 'shelljs'

shell.cp('./dist/umd/index.css','./dist/index.css')
shell.cp('./dist/umd/index.css.gz','./dist/index.css.gz')
shell.mv('./dist/es/theme', './dist' )
