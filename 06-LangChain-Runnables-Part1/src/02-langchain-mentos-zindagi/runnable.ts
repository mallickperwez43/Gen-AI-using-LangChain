abstract class Runnable {
    abstract invoke(inputData: unknown): unknown;
}

class NakliLLM extends Runnable {
    constructor() {
        super();
        console.log("LLM Created");
    }

    invoke(prompt: string): { response: string } {
        return this.predict(prompt);
    }

    predict(prompt: string): { response: string } {
        const responseList: string[] = [
            "Delhi is the capital of India",
            "IPL is a cricket league",
            "AI stands for Artificial Intelligence",
        ];

        const randomIndex: number = Math.floor(Math.random() * responseList.length);

        return {
            response: responseList[randomIndex] ?? "No response generated",
        };
    }
}

class NakliPromptTemplate extends Runnable {
    template: string;
    inputVariables: string[];

    constructor(template: string, inputVariables: string[]) {
        super();
        this.template = template;
        this.inputVariables = inputVariables;
    }

    invoke(inputDict: Record<string, string>): string {
        return this.format(inputDict);
    }

    format(inputDict: Record<string, string>): string {
        let result = this.template;

        for (const [key, value] of Object.entries(inputDict)) {
            result = result.replaceAll(`{${key}}`, value);
        }

        return result;
    }
}

class NakliStrOutputParser extends Runnable {
    constructor() {
        super();
    }

    invoke(inputData: { response: string }): string {
        return inputData.response;
    }
}

class RunnableConnector extends Runnable {
    runnableList: Runnable[];

    constructor(runnableList: Runnable[]) {
        super();

        this.runnableList = runnableList;
    }

    invoke(inputData: unknown): unknown {
        let currentData = inputData;

        for (const runnable of this.runnableList) {
            currentData = runnable.invoke(currentData);
        }

        return currentData;
    }
}

const template = new NakliPromptTemplate(
    "Write a {length} poem about {topic}",
    ["length", "topic"]
);

const llm = new NakliLLM();

const parser = new NakliStrOutputParser();

const chain = new RunnableConnector([
    template,
    llm,
    parser
]);

const result = chain.invoke({
    length: "short",
    topic: "india",
});

console.log("------------------------------------------------------");
console.log("First Chain Result : ")
console.log(result);

const template1 = new NakliPromptTemplate(
    "Write a joke about {topic}",
    ["topic"],
);

const template2 = new NakliPromptTemplate(
    "Explain the following joke {response}",
    ["response"]
);

const llm2 = new NakliLLM();

const parser2 = new NakliStrOutputParser();

const chain1 = new RunnableConnector([
    template1,
    llm2,
]);

const chain2 = new RunnableConnector([
    template2,
    llm2,
    parser2,
]);

const finalChain = new RunnableConnector([
    chain1,
    chain2
]);

const finalResult = finalChain.invoke({
    topic: "cricket",
});

console.log("------------------------------------------------------");
console.log("Final Chain Result : ")
console.log(finalResult);