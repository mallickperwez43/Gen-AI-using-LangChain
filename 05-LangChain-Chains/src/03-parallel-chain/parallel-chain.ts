import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogle } from "@langchain/google";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableParallel } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
    throw new Error("No GROQ API key found");
}

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_KEY) {
    throw new Error("No GOOGLE API key found");
}

const text: string = `
Support vector machines (SVMs) are a set of supervised learning methods used for classification, regression and outliers detection.

The advantages of support vector machines are:

Effective in high dimensional spaces.

Still effective in cases where number of dimensions is greater than the number of samples.

Uses a subset of training points in the decision function (called support vectors), so it is also memory efficient.

Versatile: different Kernel functions can be specified for the decision function. Common kernels are provided, but it is also possible to specify custom kernels.

The disadvantages of support vector machines include:

If the number of features is much greater than the number of samples, avoid over-fitting in choosing Kernel functions and regularization term is crucial.

SVMs do not directly provide probability estimates, these are calculated using an expensive five-fold cross-validation (see Scores and probabilities, below).

The support vector machines in scikit-learn support both dense (numpy.ndarray and convertible to that by numpy.asarray) and sparse (any scipy.sparse) sample vectors as input. However, to use an SVM to make predictions for sparse data, it must have been fit on such data. For optimal performance, use C-ordered numpy.ndarray (dense) or scipy.sparse.csr_matrix (sparse) with dtype=float64.
`;

const modelGroq = new ChatGroq({
    model: "qwen/qwen3.6-27b",
    temperature: 0.1,
    apiKey: GROQ_KEY,
});

const modelGoogle = new ChatGoogle({
    model: "gemini-3.1-flash-lite",
    temperature: 0.1,
    apiKey: GOOGLE_KEY,
});

const template1 = new PromptTemplate({
    template: `Generate short and simple notes from the following text \n {text}`,
    inputVariables: ["text"],
});

const template2 = new PromptTemplate({
    template: `Generate 5 short question answers from the following text \n {text}`,
    inputVariables: ["text"],
});

const template3 = new PromptTemplate({
    template: `Merge the provided notes and quiz into a single document \n notes -> {notes} and quiz -> {quiz}`,
    inputVariables: ["notes", "quiz"],
});

const parser = new StringOutputParser();

const parallelChain = new RunnableParallel({
    steps: {
        notes: template1.pipe(modelGoogle).pipe(parser),
        quiz: template2.pipe(modelGoogle).pipe(parser),
    }
});

const mergeChain = template3.pipe(modelGroq).pipe(parser);

const chain = parallelChain.pipe(mergeChain);

const result = await chain.invoke({
    text: text
});

console.log(result);
console.log(`------------------------ChainFlow----------------------------`);
console.log(chain.getGraph().drawMermaid());