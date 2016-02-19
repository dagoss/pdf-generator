const gulp = require('gulp')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const watch = require('gulp-watch')

gulp.task('default', ['js', 'sass'])

gulp.task('js', () => {
  return gulp
    .src('javascript/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('public/javascripts'))
})

gulp.task('sass', () => {
  return gulp
    .src('sass/**/main.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('public/stylesheets'))
})

gulp.task('watch-js', ['js'], () => {
  return watch('javascript/**/*.js', () => {
    gulp.start('js')
  })
})

gulp.task('sass-js', ['sass'], () => {
  return watch('sass/**/*.scss', () => {
    gulp.start('sass')
  })
})

