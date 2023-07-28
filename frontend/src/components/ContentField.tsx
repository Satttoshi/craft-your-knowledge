import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {CodeBlock} from "./CodeBlock.tsx";

type Props = {
    content: string;
};

export default function ContentField({content}: Props) {

    return (
        <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            components={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                code: CodeBlock,
            }}
        />
    );
}