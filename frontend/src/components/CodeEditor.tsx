import Editor from '@monaco-editor/react';
import {FormEvent, useState} from "react";
import styled from "@emotion/styled";
import {Workshop} from "../utils/types.ts";
import {useStore} from "../hooks/useStore.ts";
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import remarkGfm from "remark-gfm";
import {CodeBlock} from "./CodeBlock.tsx";
import ReactMarkdown from "react-markdown";

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
            {isModalOpen && <StyledChallengeResponse><ReactMarkdown
                children={content}
                remarkPlugins={[remarkGfm]}
                components={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    code: CodeBlock
                }}
            /></StyledChallengeResponse>}
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
            {challengeResponse && (challengeResponse.includes(">>>PASS<<<") ? <div>pass</div> : <div>failed</div>)}
            <LoadingButton type="submit" color="secondary" loading={isValidatingChallenge} variant="outlined"
                           endIcon={<LibraryAddCheckIcon/>}>Submit</LoadingButton>
            <Button onClick={() => setIsModalOpen(!isModalOpen)} variant="contained"
                    style={{transform: "translateX(-100%)"}}>Show Details</Button>
        </StyledForm>
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
  background: red;


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
`;

const StyledForm = styled.form`
  padding: 2rem;
  background-color: var(--color2);
  overflow: hidden;
  border-radius: 10px;
  height: 15vh;
  margin-bottom: 2.5vh;

  position: inherit;

  button {
    position: absolute;
    right: 1rem;
  }

  .monaco-editor-background {
    background-color: var(--color2);
  }

  .margin {
    background-color: var(--color2) !important;
  }
`;
