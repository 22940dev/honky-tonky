import indexLevels from "./indexLevels";

/**
 Remove a part at given index

 @param {Summary} summary
 @param {Number|} index
 @return {Summary}
 */
function removePart(summary, index) {
    const parts = summary.getParts().remove(index);
    return indexLevels(summary.set("parts", parts));
}

export default removePart;
