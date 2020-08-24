import parseStructureFile from "./parseStructureFile";
import Readme from "../models/readme";
import error from "../utils/error";

/**
 Parse readme from book

 @param {Book} book
 @return {Promise<Book>}
 */

function parseReadme(book) {
    const logger = book.getLogger();

    return parseStructureFile(book, "readme").spread((file, result) => {
        if (!file) {
            throw new error.FileNotFoundError({ filename: "README" });
        }

        logger.debug.ln("readme found at", file.getPath());

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
        const readme = Readme.create(file, result);
        return book.set("readme", readme);
    });
}

export default parseReadme;
