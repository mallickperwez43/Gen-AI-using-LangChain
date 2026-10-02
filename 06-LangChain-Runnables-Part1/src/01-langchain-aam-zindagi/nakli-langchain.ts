class NakliLLM {
    constructor() {
        console.log("LLM Created");
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

class NakliPromptTemplate {
    template: string;
    inputVariables: string[];

    constructor(template: string, inputVariables: string[]) {
        this.template = template;
        this.inputVariables = inputVariables;
    }

    format(inputDict: Record<string, string>): string {
        let result = this.template;

        for (const [key, value] of Object.entries(inputDict)) {
            result = result.replaceAll(`{${key}}`, value);
        }

        return result;
    }
}

const template = new NakliPromptTemplate(
    "Write a {length} poem about {topic}",
    ["length", "topic"]
);

const prompt = template.format({
    length: "short",
    topic: "india"
});

console.log("-----------------------------------------------")
console.log("Formatted Prompt : ");
console.log(prompt);

console.log("-----------------------------------------------")
const llm = new NakliLLM();

const result = llm.predict(prompt);
console.log("-----------------------------------------------")
console.log("LLM Result : ");
console.log(result);

class NakliLLMChain {
    llm: NakliLLM;
    prompt: NakliPromptTemplate;

    constructor(llm: NakliLLM, prompt: NakliPromptTemplate) {
        this.llm = llm;
        this.prompt = prompt;
    }

    run(inputDict: Record<string, string>): string {

        const finalPrompt = this.prompt.format(inputDict);

        const result = this.llm.predict(finalPrompt);

        return result.response;
    }
}

const template2 = new NakliPromptTemplate(
    "Write a {length} poem about {topic}",
    ["length", "topic"]
);

console.log("-----------------------------------------------")
const llm2 = new NakliLLM();

const chain = new NakliLLMChain(llm2, template2);

const output = chain.run({
    length: "short",
    prompt: "india",
});

console.log("-----------------------------------------------")
console.log("Chain Output : ")
console.log(output);