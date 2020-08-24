import Promise from "../utils/promise";
import error from "../utils/error";
import lookupStructureFile from "./lookupStructureFile";

/**
 Parse a ParsableFile using a specific method

 @param {FS} fs
 @param {ParsableFile} file
 @param {String} type
 @return {Promise<Array<String, List|Map>>}
 */
function parseFile(fs, file, type) {
    const filepath = file.getPath();
    const parser = file.getParser();

    if (!parser) {
        return Promise.reject(
            error.FileNotParsableError({
                filename: filepath,
            })
        );
    }

    return fs
        .readAsString(filepath)
        .then((content) => {
            if (type === "readme") {
                return parser.parseReadme(content);
            } else if (type === "glossary") {
                return parser.parseGlossary(content);
            } else if (type === "summary") {
                return parser.parseSummary(content);
            } else if (type === "langs") {
                return parser.parseLanguages(content);
            } else {
                throw new Error(`Parsing invalid type "${type}"`);
            }
        })
        .then((result) => {
            return [file, result];
        });
}

/**
 Parse a structure file (ex: SUMMARY.md, GLOSSARY.md).
 It uses the configuration to find the specified file.

 @param {Book} book
 @param {String} type: one of ["glossary", "readme", "summary"]
 @return {Promise<List|Map>}
 */

function parseStructureFile(book, type) {
    const fs = book.getContentFS();

    return lookupStructureFile(book, type).then((file) => {
        if (!file) return [undefined, undefined];

        return parseFile(fs, file, type);
    });
}

export default parseStructureFile;
