import Editor from '@monaco-editor/react';
import {FormEvent, useState} from "react";
import styled from "@emotion/styled";
import {Workshop} from "../utils/types.ts";
import {useStore} from "../hooks/useStore.ts";
import LoadingButton from '@mui/lab/LoadingButton';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';

type Props = {
    workshop: Workshop;
}

export default function CodeEditor({workshop}: Props) {
    const [code, setCode] = useState<string | undefined>("// start coding here ...");
    const validateChallenge = useStore((state) => state.validateChallenge);
    const [challengeResponse, setChallengeResponse] = useState<string | undefined>("");

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

    return <StyledContainer>

        <StyledEditorContainer onSubmit={handleSubmit}>
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
            <LoadingButton color="secondary" variant="outlined" endIcon={<LibraryAddCheckIcon />}>Submit</LoadingButton>
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

const StyledEditorContainer = styled.section`
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
  
  .monaco-editor-background {
    background-color: var(--color2);
  }

  .margin {
    background-color: var(--color2) !important;
  }
`;
