import meta from "./package.json" with { type: "json" };

export default {
  name: "stasherr",
  description: meta.description,
  version: meta.version,
  author: meta.author,
  source: meta.repository.url,
  updateURL: meta.repository.url + "/releases/latest/download/stasherr.meta.js",
  downloadURL:
    meta.repository.url + "/releases/latest/download/stasherr.user.js",
  supportURL: meta.repository.url,
  license: meta.license,
  match: ["*://stashdb.org/*"],
  require: [],
  grant: "GM_registerMenuCommand",
};
