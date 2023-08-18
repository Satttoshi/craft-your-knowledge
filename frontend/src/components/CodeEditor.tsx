import Editor from '@monaco-editor/react';
import {FormEvent, useState} from "react";
import styled from "@emotion/styled";
import {Workshop} from "../utils/types.ts";
import {useStore} from "../hooks/useStore.ts";
import remarkGfm from "remark-gfm";
import {CodeBlock} from "./CodeBlock.tsx";
import ReactMarkdown from "react-markdown";
import SubmitChallengeField from "./SubmitChallengeField.tsx";

type Props = {
    workshop: Workshop;
}

export default function CodeEditor({workshop}: Props) {
    const [code, setCode] = useState<string | undefined>("// start coding here ...");
    const validateChallenge = useStore((state) => state.validateChallenge);
    const [challengeResponse, setChallengeResponse] = useState<string | undefined>("");
    const isValidatingChallenge = useStore((state) => state.isValidatingChallenge);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isUserInputLongEnough, setIsUserInputLongEnough] = useState<boolean>(false);

    const editorLanguage = workshop.language.toLowerCase();

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!code) {
            alert("Your code is empty. Please try again.");
            return;
        }

        if (code.length < 100) {
            alert("Your code is too short. Please try again.");
            return;
        }

        validateChallenge(workshop.id, {
            user: {
                id: "1",
                username: "Default User"
            },
            language: editorLanguage,
            topic: workshop.topic,
            challenge: workshop.challenge.choices[0].message.content,
            answer: code
        }).then((result) => {
            setChallengeResponse(result.choices[0].message.content);
        });
    }

    function handleEditorChange(value: string | undefined) {
        setCode(value);
        if (value?.length && value.length > 100) {
            setIsUserInputLongEnough(true);
        } else {
            setIsUserInputLongEnough(false);
        }
    }

    const content: string = (challengeResponse ?? "").replace(">>>PASS<<<", "").replace(">>>FAIL<<<", "");

    return <StyledContainer>
        <StyledEditorContainer onSubmit={handleSubmit}>
            {isModalOpen && <StyledChallengeResponse>
                <StyledMarkdownContainer>
                    <ReactMarkdown
                        children={content}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            code: CodeBlock
                        }}
                    />
                </StyledMarkdownContainer>
            </StyledChallengeResponse>}
            <Editor
                height="66vh"
                theme="vs-dark"
                defaultLanguage={editorLanguage}
                defaultValue="// start coding here ..."
                onChange={handleEditorChange}
                options={{minimap: {enabled: false}}}
            />
        </StyledEditorContainer>
        <SubmitChallengeField
            handleSubmit={handleSubmit}
            isValidatingChallenge={isValidatingChallenge}
            challengeResponse={challengeResponse}
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            isUserInputLongEnough={isUserInputLongEnough}
        />
    </StyledContainer>
}



const StyledContainer = styled.div`
  padding: 0;
  margin: 0;
  overflow: hidden;
  height: 92vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledChallengeResponse = styled.div`
  background-color: var(--color2);
  overflow: scroll;

  position: absolute;
  z-index: 100;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  ::-webkit-scrollbar {
    display: none;
  }

`;

const StyledEditorContainer = styled.section`
  position: relative;
  padding: 2rem;
  background-color: var(--color2);
  border: 2px solid var(--color4);
  overflow: hidden;
  border-radius: 10px;
  height: 72vh;
  box-shadow: var(--shadow1);

  .monaco-editor-background {
    background-color: var(--color2);
  }

  .margin {
    background-color: var(--color2) !important;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem 2rem 0.5rem;
    border-radius: 0;
  }
`;

const StyledMarkdownContainer = styled.article`
  border-radius: 10px;
  padding: 2rem 12vw 2rem 2rem;
  margin: 0;
  overflow: auto;

  background: var(--color3);

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
`;
