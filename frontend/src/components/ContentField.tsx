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
  width: 90vw;
  border-radius: 10px;
  padding: 1rem;
  margin: 0;
  
  @media (min-width: 768px) {
    width: 50vw;
  }
  
  h1 {
    color: var(--color5);
  }

  h2 {
    color: var(--color4);
  }
`;
