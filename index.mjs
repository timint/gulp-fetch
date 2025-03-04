import through2 from 'through2';
import Vinyl from 'vinyl';
import fetch from 'node-fetch';

/**
 * @typedef {Object} DownloadObject
 * @property {string} url - The URL to download.
 * @property {string} [filename] - The filename to save the download as.
 */

/**
 * @typedef {string | DownloadObject | Array<string | DownloadObject>} Urls
 */

/**
 * @param {Urls} items - The URLs or download objects.
 * @returns {import('stream').Transform} - The transform stream.
 */
export default function download(items) {

  if (!Array.isArray(items)) {
    items = [items];
  }

  items = items.map(item => {
    if (typeof item === 'string') {
      return { url: item, filename: item.split('/').pop() };
    }
    if (!item.filename) {
      item.filename = item.url.split('/').pop();
    }
    if (typeof item.filename !== 'string') {
      throw new Error('Each filename must be a string.');
    }
    return item;
  });

  const stream = through2.obj(async function(file, enc, cb) {
    try {
      for (const item of items) {
        if (!item.url || !item.filename) {
          return cb(new Error('Each download object must have a "url" and "filename" property.'));
        }

        const response = await fetch(item.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${item.url}: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const vinylFile = new Vinyl({
          path: item.filename,
          contents: buffer,
        });

        this.push(vinylFile);
      }
      cb();
    } catch (error) {
      cb(new Error(`Error downloading: ${error.message}`));
    }
  });

  items.forEach(item => {
    console.log(`  - Fetching \x1b[34m${item.url}\x1b[0m as \x1b[32m${item.filename}\x1b[0m...`);
    stream.write(item);
  });

  stream.end();
  return stream;
}