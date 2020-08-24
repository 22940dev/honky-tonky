import Immutable from "immutable";
import timing from "../utils/timing";
import Page from "../models/page";
import walkSummary from "./walkSummary";
import parsePage from "./parsePage";

/**
 Parse a page from a path

 @param {Book} book
 @param {String} filePath
 @return {Page?}
 */
function parseFilePage(book, filePath) {
    const fs = book.getContentFS();

    return fs
        .statFile(filePath)
        .then(
            (file) => {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'createForFile' does not exist on type 'C... Remove this comment to see the full error message
                const page = Page.createForFile(file);
                return parsePage(book, page);
            },
            (err) => {
                // file doesn't exist
                return null;
            }
        )
        .fail((err) => {
            const logger = book.getLogger();
            logger.error.ln(`error while parsing page "${filePath}":`);
            throw err;
        });
}

/**
 Parse all pages from a book as an OrderedMap

 @param {Book} book
 @return {Promise<OrderedMap<Page>>}
 */
function parsePagesList(book) {
    const summary = book.getSummary();
    const glossary = book.getGlossary();
    let map = Immutable.OrderedMap();

    // Parse pages from summary
    return (
        timing
            .measure(
                "parse.listPages",
                walkSummary(summary, (article) => {
                    if (!article.isPage()) return;

                    const filepath = article.getPath();

                    // Is the page ignored?
                    if (book.isContentFileIgnored(filepath)) return;

                    return parseFilePage(book, filepath).then((page) => {
                        // file doesn't exist
                        if (!page) {
                            return;
                        }

                        map = map.set(filepath, page);
                    });
                })
            )

            // Parse glossary
            .then(() => {
                const file = glossary.getFile();

                if (!file.exists()) {
                    return;
                }

                return parseFilePage(book, file.getPath()).then((page) => {
                    // file doesn't exist
                    if (!page) {
                        return;
                    }

                    map = map.set(file.getPath(), page);
                });
            })

            .then(() => {
                return map;
            })
    );
}

export default parsePagesList;
