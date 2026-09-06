// equivalent to typedDict in python
import * as v from "valibot";

const PersonSchema = v.object({ // Schema using Standard Schema Library
    name: v.string(),
    age: v.number(),
});

type Person = v.InferOutput<typeof PersonSchema>;

const newPerson: Person = {
    name: "Alex",
    age: 18
};

console.log(newPerson);

const result = v.safeParse(PersonSchema, newPerson);
if (result.success) {
    console.log("Valid data: ", result.output);
}