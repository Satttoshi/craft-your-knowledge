import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock.tsx";
import styled from "@emotion/styled";
import { keyframes} from "@emotion/css";

type Props = {
    content: string;
};

export default function ContentField({ content }: Props) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState<number>(0);

    useEffect(() => {
        if (contentRef.current) {
            setContainerHeight(contentRef.current.offsetHeight);
        }
    }, []);

    console.log(containerHeight);

    const fadeIn = keyframes`
    from {
      height: 0;
    }
    to {
      height: ${containerHeight + 100}px;
    }
  `;

    const StyledContentField = styled.article`
    animation: ${fadeIn} 4s linear;
    border: 1px solid red;
    width: 100vw;
    border-radius: 10px;
    padding: 1rem;
    margin: 0;
    overflow: hidden;

    @media (min-width: 768px) {
      width: 60vw;
    }

    h1 {
      color: var(--color5);
    }

    h2,
    h3,
    h4 {
      color: var(--color4);
    }
  `;

    return (
        <StyledContentField>
            <div ref={contentRef}>
                <ReactMarkdown
                    children={content}
                    remarkPlugins={[remarkGfm]}
                    components={{
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        code: CodeBlock
                    }}
                />
            </div>
        </StyledContentField>
    );
}
