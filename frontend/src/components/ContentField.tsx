import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {CodeBlock} from "./CodeBlock.tsx";
import styled from "@emotion/styled";

type Props = {
    content: string;
};

export default function ContentField({content}: Props) {

    return (
        <StyledContentField>
            <ReactMarkdown
                children={content}
                remarkPlugins={[remarkGfm]}
                components={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    code: CodeBlock,
                }}
            />
        </StyledContentField>
    );
}

const StyledContentField = styled.article`
  width: 600px;
  border: 2px solid var(--color4);
  padding: 1rem;
`;
