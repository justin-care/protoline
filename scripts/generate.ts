import { Project, SyntaxKind } from "ts-morph";
import fs from "fs";
import path, { resolve } from "path";
import {ChatOpenAI} from "@langchain/openai";
import {configDotenv} from "dotenv";
import {JsonOutputParser} from "@langchain/core/output_parsers";
import { fileURLToPath } from 'url';


const generate = async (componentPath: string) => {

    configDotenv();

    type ResponseFormat = {
        stories: string;
        test: string;
        docs: string;
    }

    const parser = new JsonOutputParser();
    const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-5-mini",
    temperature: 1,
    });

    const storybookDir = path.resolve("storybook/src/stories/");
    // --- 1. Find changed/target component(s) ---
    if (!componentPath) {
    console.error("no component path provided");
    process.exit(1);
    }

    // --- 2. Extract props with ts-morph ---
    const project = new Project({
    tsConfigFilePath: "./tsconfig.json", // adjust if needed
    });

    const sourceFile = project.addSourceFileAtPath(componentPath);
    const componentName = path.basename(componentPath, path.extname(componentPath));

    // Assume first exported function is our component
    const componentFn = sourceFile.getVariableDeclarations()[0];
    const propsTypeNode = componentFn
    ?.getFirstDescendantByKind(SyntaxKind.TypeReference);

    let props: Record<string, string> = {};
    if (propsTypeNode) {
    const typeText = propsTypeNode.getText();
    const typeAlias = sourceFile.getTypeAlias(typeText);
    if (typeAlias) {
        typeAlias.getType().getProperties().forEach((prop) => {
        props[prop.getName()] = prop.getDeclarations()[0]
            ?.getType()
            ?.getText() || "unknown";
        });
    }
    }

    console.log(`Extracted props for ${componentName}:`, props);

    // --- 3. Agent slot (mock for now) ---
    function mockGenerate(
    component: string,
    props: Record<string, string>
    ): { stories: string; test: string; docs: string } {
    // This is where you'd drop LangChain or OpenAI call
    // For now, return simple boilerplate
    return {
        stories: `import { Meta, StoryObj } from "@storybook/react-vite";
    import { ${component} } from "../../../packages/ui/src/${component}";

    const meta: Meta<typeof ${component}> = {
    title: "UI/${component}",
    component: ${component},
    };
    export default meta;
    type Story = StoryObj<typeof ${component}>;

    export const Default: Story = { args: { ${Object.keys(props)
        .map((p) => `${p}: "example"`)
        .join(", ")} } };
    `,

        test: `import { render, screen } from "@testing-library/react";
    import { ${component} } from "../../../packages/ui/src/${component}";

    test("renders ${component}", () => {
    render(<${component} ${Object.keys(props)
        .map((p) => `${p}="test"`)
        .join(" ")} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    });
    `,

        docs: `---
    id: ${component.toLowerCase()}
    title: ${component}
    ---

    import { ${component} } from "../../../packages/ui/src/${component}";

    # ${component}

    This is the **${component}** component.

    ## Example

    <${component} ${Object.keys(props)
        .map((p) => `${p}="demo"`)
        .join(" ")} />

    ## Props

    | Name | Type |
    |------|------|
    ${Object.entries(props)
    .map(([name, type]) => `| ${name} | \`${type}\` |`)
    .join("\n")}
    `,
    };
    }

    const agentGenerate = async (component: string, props: Record<string, string>): Promise<ResponseFormat> => {
        const systemPrompt = `
        You are an expert React/TypeScript developer.
        You generate boilerplate code for a monorepo with pnpm, Storybook, Docusaurus, Vitest, and Playwright.
        Follow the project conventions strictly.
        `;

        const userPrompt = `
        Generate three artifacts for the following React component:

        Component: ${component}
        Props: ${JSON.stringify(props, null, 2)}

        Artifacts to generate:
        1. Storybook CSF 3.0 story file (TypeScript, .stories.tsx).
        - Use { Meta, StoryObj } from "@storybook/react-vite".
        - Import from "../../../packages/ui/src/${componentName}".
        - Export a default Meta.
        - Include at least "Default" and "WithCustomProps" stories.
        - Place in the same folder as the component.

        2. Vitest + React Testing Library test file (.test.tsx).
        - Import from "../../../packages/ui/src/${componentName}".
        - At minimum: render test + one interaction (e.g. click, change).
        - Use screen.getByRole where possible.
        - No snapshot tests.

        3. Docusaurus MDX doc file (.mdx).
        - Title = ${componentName}.
        - Import the component from "../../../packages/ui/src/${componentName}".
        - Include a description, an example usage, and a ## Props section in table form.

        Return your result as a JSON object with keys "stories", "test", and "docs",
        each containing the full file contents as a string.
        Do not add explanations or prose outside the JSON.
        `;

        
        const fullPrompt = systemPrompt + "\n\n" + userPrompt;

        const llmResponse = await llm.invoke(fullPrompt);

        const response = JSON.parse(llmResponse.content as string) as ResponseFormat;

        return response;
    }

    //const { stories, test, docs } = await agentGenerate(componentName, props);

    const { stories, test, docs } = await agentGenerate(componentName, props);

    //const { stories, test, docs } = mockGenerate(componentName, props);

    // --- 4. Write files ---
    const baseDir = path.dirname(componentPath);
    fs.writeFileSync(path.join(storybookDir, `${componentName}.stories.tsx`), stories);
    fs.writeFileSync(path.join(storybookDir, `${componentName}.test.tsx`), test);

    const docsDir = path.resolve("docs/docs/components");
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    fs.writeFileSync(path.join(docsDir, `${componentName}.mdx`), docs);

    console.log(`Generated docs, stories, and test for ${componentName}`);
}

export { generate };

const main = async () => {
    const componentPath = process.argv[2];
    if (!componentPath) {
      console.error("Usage: pnpm tsx scripts/generate.ts <component-path>");
      process.exit(1);
    }
    
    await generate(componentPath);
  };
  
  // Only run main() if this script is executed directly, not when imported
  
  const currentFilePath = fileURLToPath(import.meta.url);
  const executedFilePath = process.argv[1] ? resolve(process.argv[1]) : null;
  
  if (executedFilePath && resolve(currentFilePath) === resolve(executedFilePath)) {
    main().catch(console.error);
  }
  
