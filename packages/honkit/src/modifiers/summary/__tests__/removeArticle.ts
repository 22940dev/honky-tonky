import Summary from "../../../models/summary";
import FileModel from "../../../models/file";
import removeArticle from "../removeArticle";
describe("removeArticle", () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'createFromParts' does not exist on type ... Remove this comment to see the full error message
    const summary = Summary.createFromParts(FileModel(), [
        {
            articles: [
                {
                    title: "1.1",
                    path: "1.1",
                },
                {
                    title: "1.2",
                    path: "1.2",
                },
            ],
        },
        {
            title: "Part I",
            articles: [
                {
                    title: "2.1",
                    path: "2.1",
                    articles: [
                        {
                            title: "2.1.1",
                            path: "2.1.1",
                        },
                        {
                            title: "2.1.2",
                            path: "2.1.2",
                        },
                    ],
                },
                {
                    title: "2.2",
                    path: "2.2",
                },
            ],
        },
    ]);

    test("should remove an article at a given level", () => {
        const newSummary = removeArticle(summary, "2.1.1");

        const removed = newSummary.getByLevel("2.1.1");
        const nextOne = newSummary.getByLevel("2.1.2");

        expect(removed.getTitle()).toBe("2.1.2");
        expect(nextOne).toBe(null);
    });
});
