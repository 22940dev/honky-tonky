import Immutable from "immutable";
import encodeNavigation from "./encodeNavigation";

/**
 page.progress is a deprecated property from GitBook v2

 @param {Output}
 @param {Page}
 @return {Object}
 */

function encodeProgress(output, page) {
    const current = page.getPath();
    let navigation = encodeNavigation(output);
    navigation = Immutable.Map(navigation);

    const n = navigation.size;
    let percent = 0,
        prevPercent = 0,
        currentChapter = null;
    let done = true;

    const chapters = navigation
        .map((nav, chapterPath) => {
            nav.path = chapterPath;
            return nav;
        })
        .valueSeq()
        .sortBy((nav) => {
            return nav.index;
        })
        .map((nav, i) => {
            // Calcul percent
            nav.percent = (i * 100) / Math.max(n - 1, 1);

            // Is it done
            nav.done = done;
            if (nav.path == current) {
                currentChapter = nav;
                percent = nav.percent;
                done = false;
            } else if (done) {
                prevPercent = nav.percent;
            }

            return nav;
        })
        .toJS();

    return {
        // Previous percent
        prevPercent: prevPercent,

        // Current percent
        percent: percent,

        // List of chapter with progress
        chapters: chapters,

        // Current chapter
        current: currentChapter,
    };
}

export default encodeProgress;
