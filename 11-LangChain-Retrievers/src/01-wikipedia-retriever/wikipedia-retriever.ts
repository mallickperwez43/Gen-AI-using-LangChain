// Issues in code - need fixes because its not official class

import * as wikipediaModule from "wikipedia";
import { Document } from "@langchain/core/documents";
import { BaseRetriever } from "@langchain/core/retrievers";

// Wikipedia API type

type WikipediaAPI = {
    setLang: (language: string) => string;

    search: (
        query: string,
    ) => Promise<{
        results: Array<{
            title: string;
            pageid: number;
        }>;
    }>;

    page: (
        title: string,
    ) => Promise<{
        summary: () => Promise<{
            extract: string;
        }>;
    }>;
};

// Fix wikipedia package TypeScript typing

const wikipedia =
    wikipediaModule as unknown as WikipediaAPI;

// Custom Implementation of Wikipedia Retriever

class WikipediaRetriever extends BaseRetriever {

    lc_namespace = [
        "langchain",
        "retrievers",
        "wikipedia",
    ];

    topKResults: number;
    lang: string;

    constructor({
        topKResults = 2,
        lang = "en",
    }: {
        topKResults?: number;
        lang?: string;
    } = {}) {

        super({});

        this.topKResults = topKResults;
        this.lang = lang;
    }


    async _getRelevantDocuments(
        query: string,
    ): Promise<Document[]> {

        // Set Wikipedia language
        wikipedia.setLang(this.lang);


        // Search Wikipedia
        const searchResults = await wikipedia.search(query);


        // Take top K results
        const topResults = searchResults.results.slice(
            0,
            this.topKResults,
        );


        // Store LangChain documents
        const docs: Document[] = [];


        // Fetch each Wikipedia page
        for (const result of topResults) {

            const page = await wikipedia.page(
                result.title,
            );

            const summary = await page.summary();


            docs.push(
                new Document({
                    pageContent: summary.extract,

                    metadata: {
                        title: result.title,
                        pageId: result.pageid,
                    },
                }),
            );
        }


        return docs;
    }
}


// Initialize Retriever

const retriever = new WikipediaRetriever({
    topKResults: 2,
    lang: "en",
});

// Query

const query =
    "the geopolitical history of india and pakistan from the perspective of a chinese";

// Retrieve Documents

const docs = await retriever.invoke(query);


// Print Retrieved Content

for (let i = 0; i < docs.length; i++) {

    console.log(`\n--- Result ${i + 1} ---`);

    console.log(
        `Content:\n${docs[i]?.pageContent}...`,
    );
}