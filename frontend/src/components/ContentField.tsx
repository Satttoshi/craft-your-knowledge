import { useRef, useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock.tsx";
import styled from "@emotion/styled";
import { keyframes} from "@emotion/css";
import {useStore} from "../hooks/useStore.ts";


type Props = {
    content: string;
};

export default function ContentField({ content }: Props) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const isCreatingWorkshop = useStore(state => state.isCreatingWorkshop);

    useEffect(() => {
        if (contentRef.current) {
            setContainerHeight(contentRef.current.offsetHeight);
        }
    }, []);

    const fadeIn = keyframes`
    from {
      height: 0;
    }
    to {
      height: ${containerHeight + 100}px;
    }
  `;

    const StyledContentField = styled.article`
      animation: ${(props: { isCreating: boolean }) =>
              props.isCreating ? fadeIn : ""} 4s ease-in-out;

      width: 100vw;
      border-radius: 10px;
      padding: 2rem;
      margin: 0;
      overflow: hidden;
      
      background: var(--color2);

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
        <StyledContentField isCreating={isCreatingWorkshop}>
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
