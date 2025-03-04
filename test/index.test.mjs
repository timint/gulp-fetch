import { describe, it } from 'node:test';
import assert from 'node:assert';
import download from '../index.mjs';
import Vinyl from 'vinyl';
import through2 from 'through2';

describe('gulp-fetch', () => {
  it('should download a file and return a Vinyl object', () => {
    const stream = download('https://raw.githubusercontent.com/timint/gulp-fetch/refs/heads/main/LICENSE');

    return new Promise((resolve, reject) => {
      stream.pipe(through2.obj(function(file, enc, cb) {
        try {
          assert.ok(file instanceof Vinyl);
          assert.strictEqual(file.path, 'LICENSE');
          assert.ok(file.contents instanceof Buffer);
          cb();
          resolve();
        } catch (error) {
          cb(error);
          reject(error);
        }
      })).on('error', reject);
    });
  });

  it('should download a file and return a Vinyl object with custom filename', () => {
    const stream = download({
      url: 'https://raw.githubusercontent.com/timint/gulp-fetch/refs/heads/main/LICENSE',
      filename: 'license.txt'
    });

    return new Promise((resolve, reject) => {
      stream.pipe(through2.obj(function(file, enc, cb) {
        try {
          assert.ok(file instanceof Vinyl);
          assert.strictEqual(file.path, 'license.txt');
          assert.ok(file.contents instanceof Buffer);
          cb();
          resolve();
        } catch (error) {
          cb(error);
          reject(error);
        }
      })).on('error', reject);
    });
  });

  it('should handle multiple URLs', () => {
    const stream = download([
      { url: 'https://raw.githubusercontent.com/timint/gulp-fetch/refs/heads/main/LICENSE', filename: 'license.txt' },
      { url: 'https://raw.githubusercontent.com/timint/gulp-fetch/refs/heads/main/LICENSE', filename: 'license.md' }
    ]);

    let fileCount = 0;
    const expectedFiles = { 'license.txt': false, 'license.md': false };

    return new Promise((resolve, reject) => {
      stream.pipe(through2.obj(function(file, enc, cb) {
        try {
          assert.ok(file instanceof Vinyl);
          assert.ok(file.contents instanceof Buffer);

          if (file.path === 'license.txt' || file.path === 'license.md') {
            expectedFiles[file.path] = true;
            fileCount++;
          }

          cb();

          if (fileCount === 2) {
            assert.strictEqual(expectedFiles['license.txt'], true);
            assert.strictEqual(expectedFiles['license.md'], true);
            resolve();
          }
        } catch (error) {
          cb(error);
          reject(error);
        }
      })).on('error', reject);
    });
  });
});