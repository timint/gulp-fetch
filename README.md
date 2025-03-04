# gulp-fetch

A Gulp plugin that allows you to pass a remote file to pipeline using HTTP or HTTPS.

## Installation

```bash
# Install using npm package database
npm install gulp-fetch

# Or define project repository
npm install git+https://github.com/timint/gulp-fetch.git
```

## Examples of Use

### Fetching one remote file

```js
	import download from 'gulp-fetch'

	gulp.task('download', function() {
		return download('https://domain.tld/file.ext')
			.pipe(gulp.dest("downloads/"));
	});
```

```js
	import download from 'gulp-fetch'

	gulp.task('download', function() {
		return download({ url: 'https://domain.tld/file.ext', filename: 'file.ext' })
			.pipe(gulp.dest("downloads/"));
	});
```

### Fetching multiple remote files

```js
	gulp.task('download', function() {
		return download([
			'https://domain.tld/file1.ext',
			'https://domain.tld/file2.ext',
			'https://domain.tld/file3.ext'
		]).pipe(gulp.dest("downloads/"));
	});
```

```js
	gulp.task('download', function() {
		return download([
			{ url: 'https://domain.tld/file1.ext', filename: '1.ext' },
			{ url: 'https://domain.tld/file2.ext', filename: '2.ext' },
			{ url: 'https://domain.tld/file3.ext', filename: '3.ext' }
		]).pipe(gulp.dest("downloads/"));
	});
```

### Example of use with other plugins

```js
	gulp.task('download', function() {
		return download({ url: 'https://domain.tld/styles.scss', filename: 'mystyles.scss' })
			.pipe(sass());
			.pipe(sourcemaps.write());
			.pipe(cleancss())
			.pipe(rename({ extname: '.min.css' }))
			.pipe(gulp.dest("css/"));
	});
```
