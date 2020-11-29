import Immutable from "immutable";
import File from "./file";
import PluginDependency from "./pluginDependency";
import configDefault from "../constants/configDefault";
import reducedObject from "../utils/reducedObject";

class Config extends Immutable.Record(
    {
        file: File(),
        values: configDefault,
    },
    "Config"
) {
    getFile() {
        return this.get("file");
    }

    getValues() {
        return this.get("values");
    }

    /**
     * Return minimum version of configuration,
     * Basically it returns the current config minus the default one
     * @return {Map}
     */
    toReducedVersion() {
        return reducedObject(configDefault, this.getValues());
    }

    /**
     * Render config as text
     * @return {Promise<String>}
     */
    toText() {
        return JSON.stringify(this.toReducedVersion().toJS(), null, 4);
    }

    /**
     * Change the file for the configuration
     * @param {File} file
     * @return {Config}
     */
    setFile(file) {
        return this.set("file", file);
    }

    /**
     * Return a configuration value by its key path
     */
    getValue(keyPath: string | string[], def?: any) {
        const values = this.getValues();
        keyPath = Config.keyToKeyPath(keyPath);

        if (!values.hasIn(keyPath)) {
            return Immutable.fromJS(def);
        }

        return values.getIn(keyPath);
    }

    /**
     * Update a configuration value
     * @return {Config}
     */
    setValue(keyPath: string | string[], value: any): Config {
        keyPath = Config.keyToKeyPath(keyPath);

        value = Immutable.fromJS(value);

        let values = this.getValues();
        values = values.setIn(keyPath, value);

        return this.set("values", values) as Config;
    }

    /**
     * Return a list of plugin dependencies
     * @return {List<PluginDependency>}
     */
    getPluginDependencies() {
        const plugins = this.getValue("plugins");
        if (typeof plugins === "string") {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'listFromString' does not exist on type '... Remove this comment to see the full error message
            return PluginDependency.listFromString(plugins);
        } else {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'listFromArray' does not exist on type 'C... Remove this comment to see the full error message
            return PluginDependency.listFromArray(plugins);
        }
    }

    /**
     * Return a plugin dependency by its name
     * @param {String} name
     * @return {PluginDependency}
     */
    getPluginDependency(name: string) {
        const plugins = this.getPluginDependencies();

        return plugins.find((dep) => {
            return dep.getName() === name;
        });
    }

    /**
     * Update the list of plugins dependencies
     * @param {List<PluginDependency>}
     * @return {Config}
     */
    setPluginDependencies(deps) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'listToArray' does not exist on type 'Cla... Remove this comment to see the full error message
        const plugins = PluginDependency.listToArray(deps);

        return this.setValue("plugins", plugins);
    }

    /**
     * Update values for an existing configuration
     * @param {Object} values
     * @returns {Config}
     */
    updateValues(values) {
        values = Immutable.fromJS(values);

        return this.set("values", values);
    }

    /**
     * Update values for an existing configuration
     * @param {Config} config
     * @param {Object} values
     * @returns {Config}
     */
    mergeValues(values) {
        let currentValues = this.getValues();
        values = Immutable.fromJS(values);

        currentValues = currentValues.mergeDeep(values);

        return this.set("values", currentValues);
    }

    /**
     * Create a new config for a file
     * @param {File} file
     * @param {Object} values
     * @returns {Config}
     */
    static create(file, values) {
        return new Config({
            file: file,
            values: Immutable.fromJS(values),
        });
    }

    /**
     * Create a new config
     * @param {Object} values
     * @returns {Config}
     */
    static createWithValues(values) {
        return new Config({
            values: Immutable.fromJS(values),
        });
    }

    /**
     * Convert a keyPath to an array of keys
     */
    static keyToKeyPath(keyPath: string | string[]) {
        if (typeof keyPath === "string") {
            return keyPath.split(".");
        }
        return keyPath;
    }
}

export default Config;
