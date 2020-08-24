import parsePageFromString from "../parsePageFromString";
import Page from "../../models/page";

describe("parsePageFromString", () => {
    const page = new Page();

    test("should parse YAML frontmatter", () => {
        const CONTENT = "---\nhello: true\nworld: \"cool\"\n---\n# Hello World\n";
        const newPage = parsePageFromString(page, CONTENT);

        expect(newPage.getDir()).toBe("ltr");
        expect(newPage.getContent()).toBe("# Hello World\n");

        const attrs = newPage.getAttributes();
        expect(attrs.size).toBe(2);
        expect(attrs.get("hello")).toBe(true);
        expect(attrs.get("world")).toBe("cool");
    });

    test("should parse text direction (english)", () => {
        const CONTENT = "Hello World";
        const newPage = parsePageFromString(page, CONTENT);

        expect(newPage.getDir()).toBe("ltr");
        expect(newPage.getContent()).toBe("Hello World");
        expect(newPage.getAttributes().size).toBe(0);
    });

    test("should parse text direction (arab)", () => {
        const CONTENT = "مرحبا بالعالم";
        const newPage = parsePageFromString(page, CONTENT);

        expect(newPage.getDir()).toBe("rtl");
        expect(newPage.getContent()).toBe("مرحبا بالعالم");
        expect(newPage.getAttributes().size).toBe(0);
    });
});
