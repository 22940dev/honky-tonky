import listDependencies from "./listDependencies";

/**
 * List all plugin requirements for a book.
 * It can be different from the final list of plugins,
 * since plugins can have their own dependencies
 *
 * @param {Book}
 * @return {List<PluginDependency>}
 */

function listDepsForBook(book) {
    const config = book.getConfig();
    const plugins = config.getPluginDependencies();

    return listDependencies(plugins);
}

export default listDepsForBook;
