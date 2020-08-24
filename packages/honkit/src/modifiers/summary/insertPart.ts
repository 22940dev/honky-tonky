import SummaryPart from "../../models/summaryPart";
import indexLevels from "./indexLevels";

/**
 Returns a new Summary with a part inserted at given index

 @param {Summary} summary
 @param {Part} part
 @param {Number} index
 @return {Summary}
 */
function insertPart(summary, part, index) {
    part = SummaryPart(part);

    const parts = summary.getParts().insert(index, part);
    return indexLevels(summary.set("parts", parts));
}

export default insertPart;
