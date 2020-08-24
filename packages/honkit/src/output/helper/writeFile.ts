import path from "path";
import fs from "../../utils/fs";

/**
 Write a file to the output folder

 @param {Output} output
 @param {String} filePath
 @param {Buffer|String} content
 @return {Promise}
 */

function writeFile(output, filePath, content) {
    const rootFolder = output.getRoot();
    filePath = path.join(rootFolder, filePath);

    return fs
        .ensureFile(filePath)
        .then(() => {
            return fs.writeFile(filePath, content);
        })
        .thenResolve(output);
}

export default writeFile;
