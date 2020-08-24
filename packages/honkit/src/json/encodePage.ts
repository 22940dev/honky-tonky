import encodeSummaryArticle from "./encodeSummaryArticle";

/**
 Return a JSON representation of a page

 @param {Page} page
 @param {Summary} summary
 @return {Object}
 */

function encodePage(page, summary) {
    const file = page.getFile();
    const attributes = page.getAttributes();
    const article = summary.getByPath(file.getPath());

    const result = attributes.toJS();

    if (article) {
        result.title = article.getTitle();
        result.level = article.getLevel();
        result.depth = article.getDepth();

        const nextArticle = summary.getNextArticle(article);
        if (nextArticle) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
            result.next = encodeSummaryArticle(nextArticle);
        }

        const prevArticle = summary.getPrevArticle(article);
        if (prevArticle) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
            result.previous = encodeSummaryArticle(prevArticle);
        }
    }

    result.content = page.getContent();
    result.dir = page.getDir();

    return result;
}

export default encodePage;
