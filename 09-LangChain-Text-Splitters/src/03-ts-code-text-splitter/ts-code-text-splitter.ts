import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const text = `
class Student {
    name: string;
    age: number;
    grade: number;

    constructor(name: string, age: number, grade: number) {
        this.name = name;
        this.age = age;
        this.grade = grade;
    }

    getDetails(): string {
        return this.name;
    }

    isPassing(): boolean {
        return this.grade >= 6.0;
    }
}

const student1 = new Student("Aarav", 20, 8.2);

console.log(student1.getDetails());

if (student1.isPassing()) {
    console.log("The student is passing.");
} else {
    console.log("The student is not passing.");
}
`;

const splitter = RecursiveCharacterTextSplitter.fromLanguage(
    "js",
    {
        chunkSize: 500,
        chunkOverlap: 0,
    }
);

const chunks = await splitter.splitText(text);

console.log(chunks.length);
console.log(chunks);
console.log(chunks[1]);