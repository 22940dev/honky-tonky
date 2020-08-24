import Immutable from "immutable";
import { generateBook, incrementalBuild } from "./generateBook";
import json from "./json";
import website from "./website";
import ebook from "./ebook";
const generators = Immutable.List([json, website, ebook]);

/**
 Return a specific generator by its name

 @param {String}
 @return {Generator}
 */
function getGenerator(name) {
    return generators.find((generator) => {
        return generator.name == name;
    });
}

export default {
    generate: generateBook,
    incrementalBuild,
    getGenerator: getGenerator,
};
