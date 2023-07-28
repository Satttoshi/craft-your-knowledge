import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
    content: string;
};

export default function ContentField({content}: Props) {

    console.log(content)

    const testMd = `# instagram-on-steroids

This is an automation for instagram to daily like
content based on different hashtags

## Setup Guide

Requirements:

- need Chrome installed
- need Node.js installed

* [x] todo

1. Create .env file.
2. Insert into it:

\`\`\`json
IG_USERNAME="insertUsername"
IG_PASSWORD="insertPassword"
\`\`\`

3. Open terminal within the directory of index.js
4. Run with \`node index\`
`;

    return (
        <ReactMarkdown children={testMd} remarkPlugins={[remarkGfm]}/>
    );
}