const fs = require("fs");
const path = require("path");
const assert = require("assert");

const page = require("../").page;

it("should gen content", function () {
    const CONTENT = fs.readFileSync(path.join(__dirname, "./fixtures/PAGE.adoc"), "utf8");
    const LEXED = page(CONTENT);
    assert(LEXED.content);
});

it("should include file", function () {
    const result = page(`= GitBook User Manual

== Usage

include::src/__tests__/fixtures/usage.adoc[]
`).content;
    // assert.match is available in Node > 12.16.0
    assert(result.match(/create a book/g) !== null);
});

it("should use font icons by default", function () {
    const result = page(`= HonKit User Manual

== Install

IMPORTANT: Do not forgot to install \`yarn\`
`).content;
    // assert.match is available in Node > 12.16.0
    assert(result.match(/fa icon-important/g) !== null);
});

it("should allow users to override icons attribute", function () {
    const result = page(`= HonKit User Manual
// override icons attribute
:icons:

== Install

IMPORTANT: Do not forgot to install \`yarn\`
`).content;
    // assert.doesNotMatch is available in Node > 12.16.0
    assert(result.match(/fa icon-important/g) === null);
});

