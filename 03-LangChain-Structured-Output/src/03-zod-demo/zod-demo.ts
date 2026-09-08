import { z } from "zod";

const studentSchema = z.object({
    name: z.string().default("Alex"),
    age: z.number().optional(),
    email: z.email().optional(),
    cgpa: z.number().gt(0).lt(10).default(5).describe("A decimal value representing the cgpa of the student"),
});

type StudentType = z.infer<typeof studentSchema>;

const unverifiedInput = {
    name: "Mercer",
    email: "mercer@example.in",
    age: 31,
    cgpa: 8.3,
};

const student = studentSchema.safeParse(unverifiedInput);

console.log(unverifiedInput);
console.log(typeof (unverifiedInput));
console.log(student);
console.log(typeof (student));


// console.log(unverifiedInput instanceof Object); // true
// console.log(student instanceof Object);         // true (because everything is an object)

// console.log("Is student a Zod parsing result?");
// // Check if the property 'success' exists on it, which is unique to safeParse results
// if ("success" in student) {
//     console.log("Yes! This has Zod safeParse properties.");
// }
// console.log(studentSchema.constructor.name);  
