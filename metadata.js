import meta from "./package.json" with { type: "json" };

export default {
  name: "fanarr",
  description: meta.description,
  version: meta.version,
  author: meta.author,
  source: meta.repository.url,
  updateURL: meta.repository.url + "/releases/latest/download/fanarr.meta.js",
  downloadURL:
    meta.repository.url + "/releases/latest/download/fanarr.user.js",
  supportURL: meta.repository.url,
  license: meta.license,
  match: ["*://fansdb.cc/*"],
  require: [],
  grant: ["GM_registerMenuCommand", "GM_xmlhttpRequest", "GM.xmlHttpRequest"],
};
