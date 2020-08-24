import Parse from "../parse";

/**
 List all assets in the book

 @param {Output}
 @return {Promise<Output>}
 */

function prepareAssets(output) {
    const book = output.getBook();
    const pages = output.getPages();
    const logger = output.getLogger();

    return Parse.listAssets(book, pages).then((assets) => {
        logger.info.ln("found", assets.size, "asset files");

        return output.set("assets", assets);
    });
}

export default prepareAssets;
