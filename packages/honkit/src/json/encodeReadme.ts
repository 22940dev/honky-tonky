import encodeFile from "./encodeFile";

/**
 Encode a readme to JSON

 @param {Readme}
 @return {Object}
 */

function encodeReadme(readme) {
    const file = readme.getFile();

    return {
        file: encodeFile(file),
    };
}

export default encodeReadme;
