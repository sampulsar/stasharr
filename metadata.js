import meta from "./package.json" with { type: "json" };

export default {
  name: "stasherr",
  description: meta.description,
  version: meta.version,
  author: meta.author,
  source: meta.source,
  license: meta.license,
  match: ["*://stashdb.org/*"],
  require: [],
  grant: "GM_registerMenuCommand",
};
