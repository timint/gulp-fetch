import { Transform } from "stream";

declare module "gulp-fetch" {
  interface remoteItem {
    url: string;
    filename?: string;
  }

  type Urls = string | remoteItem | Array<string | remoteItem>;

  function download(items: Urls): Transform;

  export = download;
}
