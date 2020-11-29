import Immutable from "immutable";
import File from "./file";

const Readme = Immutable.Record({
    file: new File(),
    title: String(),
    description: String(),
});

Readme.prototype.getFile = function () {
    return this.get("file");
};

Readme.prototype.getTitle = function () {
    return this.get("title");
};

Readme.prototype.getDescription = function () {
    return this.get("description");
};

/**
 Create a new readme

 @param {File} file
 @param {Object} def
 @return {Readme}
 */

// @ts-expect-error ts-migrate(2339) FIXME: Property 'create' does not exist on type 'Class'.
Readme.create = function (file, def) {
    def = def || {};

    return new Readme({
        file: file,
        title: def.title || "",
        description: def.description || "",
    });
};

export default Readme;
