import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {CodeBlock} from "./CodeBlock.tsx";
import styled from "@emotion/styled";
import {keyframes} from "@emotion/css";
import {useStore} from "../hooks/useStore.ts";

type Props = {
    content: string;
};

export default function ContentField({content}: Props) {
    const playAnimation = useStore(state => state.playAnimation);

    return (<>
        <StyledContentField playAnimation={playAnimation}>
                <ReactMarkdown
                    children={content}
                    remarkPlugins={[remarkGfm]}
                    components={{
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        code: CodeBlock
                    }}
                />
        </StyledContentField>

    </>);
}

const fadeIn = keyframes`
      0% {
        height: 0;
      }
      100% {
        height: 92vh;
      }
    `;

const StyledContentField = styled.article`

  align-self: start;

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
    font-size: clamp(1.5rem, 2vw, 4rem);
    font-weight: 400;
  }

  h2,
  h3,
  h4 {
    color: var(--color4);
  }

  @media (max-width: 768px) {

    h1 {
      font-size: clamp(1.5rem, 2vw, 3rem);
    }

    padding: 3vw;
    border-radius: 0;

    ::-webkit-scrollbar {
      display: none;
    }

    ::-webkit-scrollbar-thumb {
      display: none;
    }
  }
`;
