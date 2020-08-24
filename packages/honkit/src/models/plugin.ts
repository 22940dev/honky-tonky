import Immutable from "immutable";
import TemplateBlock from "./templateBlock";
import PluginDependency from "./pluginDependency";
import THEME_PREFIX from "../constants/themePrefix";

const DEFAULT_VERSION = "*";

const Plugin = Immutable.Record(
    {
        name: String(),

        // Requirement version (ex: ">1.0.0")
        version: String(DEFAULT_VERSION),

        // Path to load this plugin
        path: String(),

        // Depth of this plugin in the dependency tree
        depth: Number(0),

        // Parent depending on this plugin
        parent: String(),

        // Content of the "package.json"
        package: Immutable.Map(),

        // Content of the package itself
        content: Immutable.Map(),
    },
    "Plugin"
);

Plugin.prototype.getName = function () {
    return this.get("name");
};

Plugin.prototype.getPath = function () {
    return this.get("path");
};

Plugin.prototype.getVersion = function () {
    return this.get("version");
};

Plugin.prototype.getPackage = function () {
    return this.get("package");
};

Plugin.prototype.getContent = function () {
    return this.get("content");
};

Plugin.prototype.getDepth = function () {
    return this.get("depth");
};

Plugin.prototype.getParent = function () {
    return this.get("parent");
};

/**
 * Return the ID on NPM for this plugin
 * @return {String}
 */

Plugin.prototype.getNpmID = function () {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'nameToNpmID' does not exist on type 'Cla... Remove this comment to see the full error message
    return PluginDependency.nameToNpmID(this.getName());
};

/**
 * Check if a plugin is loaded
 * @return {Boolean}
 */

Plugin.prototype.isLoaded = function () {
    return Boolean(this.getPackage().size > 0);
};

/**
 * Check if a plugin is a theme given its name
 * @return {Boolean}
 */

Plugin.prototype.isTheme = function () {
    const name = this.getName();
    return name && name.indexOf(THEME_PREFIX) === 0;
};

/**
 * Return map of hooks
 * @return {Map<String:Function>}
 */

Plugin.prototype.getHooks = function () {
    return this.getContent().get("hooks") || Immutable.Map();
};

/**
 * Return infos about resources for a specific type
 * @param {String} type
 * @return {Map<String:Mixed>}
 */

Plugin.prototype.getResources = function (type) {
    if (type != "website" && type != "ebook") {
        throw new Error(`Invalid assets type ${type}`);
    }

    const content = this.getContent();
    return content.get(type) || (type == "website" ? content.get("book") : null) || Immutable.Map();
};

/**
 * Return map of filters
 * @return {Map<String:Function>}
 */

Plugin.prototype.getFilters = function () {
    return this.getContent().get("filters");
};

/**
 * Return map of blocks
 * @return {Map<String:TemplateBlock>}
 */

Plugin.prototype.getBlocks = function () {
    let blocks = this.getContent().get("blocks");
    blocks = blocks || Immutable.Map();

    return blocks.map((block, blockName) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
        return TemplateBlock.create(blockName, block);
    });
};

/**
 * Return a specific hook
 * @param {String} name
 * @return {Function|undefined}
 */

Plugin.prototype.getHook = function (name) {
    return this.getHooks().get(name);
};

/**
 * Create a plugin from a string
 * @param {String}
 * @return {Plugin}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromString' does not exist on type... Remove this comment to see the full error message
Plugin.createFromString = function (s) {
    const parts = s.split("@");
    const name = parts[0];
    const version = parts.slice(1).join("@");

    return new Plugin({
        name: name,
        version: version || DEFAULT_VERSION,
    });
};

/**
 * Create a plugin from a dependency
 * @param {PluginDependency}
 * @return {Plugin}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromDep' does not exist on type 'C... Remove this comment to see the full error message
Plugin.createFromDep = function (dep) {
    return new Plugin({
        name: dep.getName(),
        version: dep.getVersion(),
    });
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'nameToNpmID' does not exist on type 'Cla... Remove this comment to see the full error message
Plugin.nameToNpmID = PluginDependency.nameToNpmID;

export default Plugin;
