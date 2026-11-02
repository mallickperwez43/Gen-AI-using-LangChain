import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const text = `
# Project Name: Smart Student Tracker

A simple Python-based project to manage and track student data, including their grades, age, and academic status.

## Features

- Add new students with relevant info
- View student details
- Check if a student is passing
- Easily extendable class-based design

## 🛠 Tech Stack

- Python 3.10+
- No external dependencies

## Getting Started

1. Clone the repo
   \`\`\`bash
   git clone https://github.com/your-username/student-tracker.git
   \`\`\`
`;

const splitter = RecursiveCharacterTextSplitter.fromLanguage(
    "markdown",
    {
        chunkSize: 200,
        chunkOverlap: 0,
    }
);

const chunks = await splitter.splitText(text);

console.log(chunks.length);
console.log(chunks);
console.log(chunks[1]);