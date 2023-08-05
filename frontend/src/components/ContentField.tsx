import {useRef, useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {CodeBlock} from "./CodeBlock.tsx";
import styled from "@emotion/styled";
import {keyframes} from "@emotion/css";
import {useStore} from "../hooks/useStore.ts";
import LinearProgress from "@mui/material/LinearProgress";

type Props = {
    content: string;
};

export default function ContentField({content}: Props) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const playAnimation = useStore(state => state.playAnimation);

    useEffect(() => {
        if (contentRef.current) {
            setContainerHeight(contentRef.current.offsetHeight);
        }
    }, []);

    const fadeIn = keyframes`
      0% {
        height: 0;
      }
      10%{
        height: 0;
      }
      100% {
        height: ${containerHeight + 100}px;
      }
    `;

    const StyledContentField = styled.article`

      animation: ${(props: { playAnimation: boolean }) =>
              props.playAnimation ? fadeIn : ""} 4s ease-in-out;

      border-radius: 10px;
      padding: 2rem;
      margin: 0;
      overflow: auto;

      background: var(--color2);

      height: 92vh;

      ::-webkit-scrollbar {
        width: 0.5rem;
        background: var(--color3);
        border-radius: 0 10px 10px 0;
      }

      ::-webkit-scrollbar-thumb {
        background: var(--color4);
        border-radius: 0 10px 10px 0;
      }


      h1 {
        color: var(--color5);
      }

      h2,
      h3,
      h4 {
        color: var(--color4);
      }

      @media (max-width: 768px) {

        padding: 0.5rem;
        border-radius: 0;

        ::-webkit-scrollbar {
          display: none;
        }

        ::-webkit-scrollbar-thumb {
          display: none;
        }

      }
    `;

    return (<>
        <StyledContentField playAnimation={playAnimation}>
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
        {playAnimation && <StyledLoadingBar/>}
    </>);
}

const StyledLoadingBar = styled(LinearProgress)`
  width: 50vw;
  height: 0.5rem;
  margin: 1rem 0;
  border-radius: 16px;
`;
