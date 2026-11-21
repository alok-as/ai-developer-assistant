export type TCodeExample = {
  id: string;
  title: string;
  topic: "react" | "typescript" | "javascript";
  description: string;
  code: string;
};

export const codeExamples: TCodeExample[] = [
  {
    id: "react-server-component",
    title: "React Server Component",
    topic: "react",
    description: "A basic asynchronous Server Component.",
    code: `
        export default async function UserProfile() {
            const response = await fetch("https://api.example.com/user");
            const user = await response.json();

            return <h1>{user.name}</h1>;
        }
    `,
  },
  {
    id: "react-client-component",
    title: "React Client Component",
    topic: "react",
    description: "A component that uses client-side state.",
    code: `
        "use client";

        import { useState } from "react";

        export default function Counter() {
        const [count, setCount] = useState(0);

        return (
            <button onClick={() => setCount(count + 1)}>
                Count: {count}
            </button>
        );
        }
    `,
  },
  {
    id: "javascript-promise",
    title: "JavaScript Promise",
    topic: "javascript",
    description: "Creating and consuming a Promise.",
    code: `
        const fetchUser = () => (
            new Promise((resolve) => {
                resolve({ id: 1, name: "Alex" });
            })
        );

        const user = await fetchUser();
        console.log(user);
    `,
  },
  {
    id: "typescript-generics",
    title: "TypeScript Generic Function",
    topic: "typescript",
    description: "A reusable function using generics.",
    code: `
        function identity<T>(value: T): T {
            return value;
        }

        const name = identity<string>("Alex");
        const age = identity<number>(25);
    `,
  },
];
