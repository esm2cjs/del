var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var esm_exports = {};
__export(esm_exports, {
  deleteAsync: () => deleteAsync,
  deleteSync: () => deleteSync
});
module.exports = __toCommonJS(esm_exports);
var import_node_util = require("node:util");
var import_node_path = __toESM(require("node:path"));
var import_node_process = __toESM(require("node:process"));
var import_globby = require("@esm2cjs/globby");
var import_is_glob = __toESM(require("is-glob"));
var import_slash = __toESM(require("@esm2cjs/slash"));
var import_graceful_fs = __toESM(require("graceful-fs"));
var import_is_path_cwd = __toESM(require("@esm2cjs/is-path-cwd"));
var import_is_path_inside = __toESM(require("@esm2cjs/is-path-inside"));
var import_rimraf = __toESM(require("rimraf"));
var import_p_map = __toESM(require("@esm2cjs/p-map"));
const rimrafP = (0, import_node_util.promisify)(import_rimraf.default);
const rimrafOptions = {
  glob: false,
  unlink: import_graceful_fs.default.unlink,
  unlinkSync: import_graceful_fs.default.unlinkSync,
  chmod: import_graceful_fs.default.chmod,
  chmodSync: import_graceful_fs.default.chmodSync,
  stat: import_graceful_fs.default.stat,
  statSync: import_graceful_fs.default.statSync,
  lstat: import_graceful_fs.default.lstat,
  lstatSync: import_graceful_fs.default.lstatSync,
  rmdir: import_graceful_fs.default.rmdir,
  rmdirSync: import_graceful_fs.default.rmdirSync,
  readdir: import_graceful_fs.default.readdir,
  readdirSync: import_graceful_fs.default.readdirSync
};
function safeCheck(file, cwd) {
  if ((0, import_is_path_cwd.default)(file)) {
    throw new Error("Cannot delete the current working directory. Can be overridden with the `force` option.");
  }
  if (!(0, import_is_path_inside.default)(file, cwd)) {
    throw new Error("Cannot delete files/directories outside the current working directory. Can be overridden with the `force` option.");
  }
}
function normalizePatterns(patterns) {
  patterns = Array.isArray(patterns) ? patterns : [patterns];
  patterns = patterns.map((pattern) => {
    if (import_node_process.default.platform === "win32" && (0, import_is_glob.default)(pattern) === false) {
      return (0, import_slash.default)(pattern);
    }
    return pattern;
  });
  return patterns;
}
async function deleteAsync(patterns, { force, dryRun, cwd = import_node_process.default.cwd(), onProgress = () => {
}, ...options } = {}) {
  options = {
    expandDirectories: false,
    onlyFiles: false,
    followSymbolicLinks: false,
    cwd,
    ...options
  };
  patterns = normalizePatterns(patterns);
  const paths = await (0, import_globby.globby)(patterns, options);
  const files = paths.sort((a, b) => b.localeCompare(a));
  if (files.length === 0) {
    onProgress({
      totalCount: 0,
      deletedCount: 0,
      percent: 1
    });
  }
  let deletedCount = 0;
  const mapper = async (file) => {
    file = import_node_path.default.resolve(cwd, file);
    if (!force) {
      safeCheck(file, cwd);
    }
    if (!dryRun) {
      await rimrafP(file, rimrafOptions);
    }
    deletedCount += 1;
    onProgress({
      totalCount: files.length,
      deletedCount,
      percent: deletedCount / files.length
    });
    return file;
  };
  const removedFiles = await (0, import_p_map.default)(files, mapper, options);
  removedFiles.sort((a, b) => a.localeCompare(b));
  return removedFiles;
}
function deleteSync(patterns, { force, dryRun, cwd = import_node_process.default.cwd(), ...options } = {}) {
  options = {
    expandDirectories: false,
    onlyFiles: false,
    followSymbolicLinks: false,
    cwd,
    ...options
  };
  patterns = normalizePatterns(patterns);
  const files = (0, import_globby.globbySync)(patterns, options).sort((a, b) => b.localeCompare(a));
  const removedFiles = files.map((file) => {
    file = import_node_path.default.resolve(cwd, file);
    if (!force) {
      safeCheck(file, cwd);
    }
    if (!dryRun) {
      import_rimraf.default.sync(file, rimrafOptions);
    }
    return file;
  });
  removedFiles.sort((a, b) => a.localeCompare(b));
  return removedFiles;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteAsync,
  deleteSync
});
//# sourceMappingURL=index.js.map
