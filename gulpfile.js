var gulp = require('gulp'),
    //编译ES6
    babel = require('gulp-babel'),
    //压缩js
    uglify = require('gulp-uglify'),
    //编译Less
    less = require('gulp-less'),
    //压缩css
    minifyCss = require('gulp-minify-css'),
    //自动前缀补全
    autoprefixer = require('gulp-autoprefixer'),
    //压缩HTML
    minifyHtml = require('gulp-minify-html'),
    //压缩图片
    imagemin = require('gulp-imagemin'),
    //错误处理提示插件
    plumber = require('gulp-plumber'),

    connect = require('gulp-connect'),

    //控制task中的串行和并行。（gulp默认是并行）
    runSequence = require('gulp-run-sequence'),
    //用来删除文件
    clean = require('gulp-clean');

//创建一个名为default的任务（这个任务必须有，不然在终端执行gulp命令会报错）
gulp.task('default', ['start'], function () {
    connect.server({
        root: 'dist',
        port: 8000,
        livereload: true
    });
    require('opn')('http://localhost:8000');
});

gulp.task('build', ['js', 'images', 'less', 'html']);

//创建一个名为js的任务
gulp.task('js', function () {
    // 获取src/js下的所有.js文件（包含所有子文件夹)
    return gulp.src('src/js/**/*.js')
        .pipe(connect.reload()) //重新加载
        //错误管理模块（有错误时会自动输出提示到终端上）
        .pipe(plumber())
        //编译ES6
        .pipe(babel({
            presets: ['es2015']
        }))
        //js压缩
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

//创建一个名为less的任务
gulp.task('less', function () {
    // 获取src/less下的所有.less文件（包含所有子文件夹)
    return gulp.src('src/less/**/*.less')
        .pipe(connect.reload()) //重新加载
        //错误管理模块（有错误时会自动输出提示到终端上）
        .pipe(plumber())
        //编译less文件使其转换为css文件
        .pipe(less())
        //前缀自动补全插件
        .pipe(autoprefixer())
        //css压缩
        .pipe(minifyCss())
        .pipe(gulp.dest('src/css'))
        .pipe(gulp.dest('dist/css'))
});

//创建一个名为html的任务
gulp.task('html', function () {
    // 获取src/pages下的所有.html文件（包含所有子文件夹)
    return gulp.src('src/pages/**/*.html')
        .pipe(connect.reload()) //重新加载
        //错误管理模块（有错误时会自动输出提示到终端上）
        .pipe(plumber())
        //html压缩
        .pipe(minifyHtml())
        .pipe(gulp.dest('dist/pages'))
});

//创建一个名为images的任务
gulp.task('images', function () {
    // 获取src/images下的所有.{png,jpg,jpeg,ico,gif,svg}后缀的图片文件（包含所有子文件夹)
    return gulp.src('src/images/**/*.{png,jpg,jpeg,ico,gif,svg}')
        .pipe(connect.reload()) //重新加载
        //错误管理模块（有错误时会自动输出提示到终端上）
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/images'))
});

//创建一个名为clean的任务
gulp.task('clean', function () {
    return gulp.src('dist/*', {read: false})
    //删除dist/*下的所有文件
        .pipe(clean())
});

//创建一个名为watch的任务
gulp.task('watch', ['build'], function () {
    //监听各个目录的文件，如果有变动则执行相应的任务操作文件
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/less/**/*.less', ['less']);
    gulp.watch('src/pages/**/*.html', ['html']);
});

//创建一个名为start的任务
gulp.task('start', function () {
    //先运行clean，然后并行运行html,js,less,images,打包完毕后再监听watch
    runSequence(['clean'], ['html', 'less', 'js', 'images'], ['watch']);
});
