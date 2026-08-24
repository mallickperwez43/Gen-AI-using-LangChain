import { ChatGoogle } from "@langchain/google";
import { StringOutputParser } from "@langchain/core/output_parsers";
import template from "../../../../../03-prompt-generator/prompt-generator"
import { NextRequest, NextResponse } from "next/server";

const model = new ChatGoogle({
    model: "gemini-3.5-flash",
    temperature: 0.1,
});

const parser = new StringOutputParser();

const chain = template.pipe(model).pipe(parser);

export async function POST(req: NextRequest) {
    try {
        const { paperInput, styleInput, lengthInput } = await req.json();

        const result = await chain.invoke({
            paper_input: paperInput,
            style_input: styleInput,
            length_input: lengthInput
        });

        return NextResponse.json({
            result
        });
    } catch (error) {
        console.error("Gemini error:", error);

        return NextResponse.json({
            error: "Failed to generate response",
        }, {
            status: 500,
        });
    }
}