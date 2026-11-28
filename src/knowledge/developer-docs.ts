export type TDeveloperDocument = {
  id: string;
  title: string;
  topic: string;
  content: string;
};

export const developerDocs: TDeveloperDocument[] = [
  {
    id: "react-server-components",
    title: "React Server Components",
    topic: "react",
    content:
      "React Server Components render on the server. They can access server-side resources and send rendered component output to the client. They reduce the need to send component JavaScript to the browser.",
  },
  {
    id: "react-client-components",
    title: "React Client Components",
    topic: "react",
    content:
      "Client Components support browser interactivity, event handlers, state, and effects. In frameworks supporting React Server Components, the use client directive marks a client module boundary.",
  },
  {
    id: "react-reconciliation",
    title: "React Reconciliation",
    topic: "react",
    content:
      "Reconciliation is the process React uses to compare the previous and next element trees and determine the updates needed to synchronize the UI.",
  },
  {
    id: "javascript-event-loop",
    title: "JavaScript Event Loop",
    topic: "javascript",
    content:
      "The event loop coordinates execution of JavaScript tasks, microtasks, and other asynchronous callbacks. It allows JavaScript environments to handle asynchronous operations.",
  },
  {
    id: "typescript-generics",
    title: "TypeScript Generics",
    topic: "typescript",
    content:
      "Generics allow functions, classes, and interfaces to work with different types while preserving type information.",
  },
];
