import Editor from '@monaco-editor/react';
import {FormEvent, useState} from "react";
import styled from "@emotion/styled";
import {Workshop} from "../utils/types.ts";
import {useStore} from "../hooks/useStore.ts";
import LoadingButton from '@mui/lab/LoadingButton';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import remarkGfm from "remark-gfm";
import {CodeBlock} from "./CodeBlock.tsx";
import ReactMarkdown from "react-markdown";
import ChallengeResponse from "./ChallengeResponse.tsx";
import Button from "@mui/material/Button";

type Props = {
    workshop: Workshop;
}

export default function CodeEditor({workshop}: Props) {
    const [code, setCode] = useState<string | undefined>("// start coding here ...");
    const validateChallenge = useStore((state) => state.validateChallenge);
    const [challengeResponse, setChallengeResponse] = useState<string | undefined>("");
    const isValidatingChallenge = useStore((state) => state.isValidatingChallenge);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
                name: "Default User"
            },
            language: editorLanguage,
            topic: workshop.topic,
            challenge: workshop.challenge.choices[0].message.content,
            answer: code
        }).then((result) => {
            setChallengeResponse(result.choices[0].message.content);
        });
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
                onChange={(value) => setCode(value)}
                options={{minimap: {enabled: false}}}
            />
        </StyledEditorContainer>
        <StyledForm onSubmit={handleSubmit}>
            <StyledButtonGroup>
                <LoadingButton type="submit" color="secondary" loading={isValidatingChallenge} variant="outlined"
                               endIcon={<LibraryAddCheckIcon/>}>Submit</LoadingButton>
                {challengeResponse &&
                    <Button style={{width: "9rem", minWidth: "9rem", marginLeft: "1rem"}}
                            onClick={() => setIsModalOpen(!isModalOpen)}
                            variant={isModalOpen ? "outlined" : "contained"}>
                        {isModalOpen ? "Hide Details" : "Show Details"}
                    </Button>}
            </StyledButtonGroup>
            <ChallengeResponse challengeResponse={challengeResponse}/>
        </StyledForm>
    </StyledContainer>
}

const StyledButtonGroup = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  gap: 1rem;
  height: 4rem;
`;


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

`;

const StyledEditorContainer = styled.section`
  position: relative;
  padding: 2rem;
  background-color: var(--color2);
  border: 2px solid var(--color4);
  overflow: hidden;
  border-radius: 10px;
  height: 72vh;

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

const StyledForm = styled.form`
  padding: 0 2rem;
  background-color: var(--color2);
  overflow: hidden;
  border-radius: 10px;
  height: 15vh;
  margin-bottom: 2.5vh;

  position: inherit;

  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;


  h3 {
    margin: 0;
    padding: 0;
  }

  .monaco-editor-background {
    background-color: var(--color2);
  }

  .margin {
    background-color: var(--color2) !important;
  }

  @media (max-width: 768px) {
    height: 18vh;
    margin-bottom: 0.5vh;
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
