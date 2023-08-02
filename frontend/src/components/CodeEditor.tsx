import Editor from '@monaco-editor/react';
import {FormEvent, useState} from "react";
import styled from "@emotion/styled";
import {Workshop} from "../utils/types.ts";

type Props = {
    workshop: Workshop;
}

export default function CodeEditor({workshop}: Props) {
    const [code, setCode] = useState<string | undefined>("// start coding here ...");

    const editorLanguage = workshop.language.toLowerCase();

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        console.log(code);

        validateChallenge(workshop.id, {
            user: {
                id: "1",
                name: "Default User"
            },
            language: editorLanguage,
            topic: workshop.topic,
            challenge: workshop.challenge.choices[0].message.content,
            answer: code
        })
    }

    return <StyledForm onSubmit={handleSubmit}><Editor
        height="80vh"
        theme="vs-dark"
        defaultLanguage={editorLanguage}
        defaultValue="// start coding here ..."
        onChange={(value) => setCode(value)}
        options={{minimap: {enabled: false}}}
    />
        <button type="submit">Submit</button>
    </StyledForm>
}

const StyledForm = styled.form`
  margin-top: 1rem;
  padding: 2rem;
  background-color: var(--color2);
  border: 2px solid var(--color4);
  width: 60vw;
  overflow: hidden;
  border-radius: 15px;

  @media (max-width: 768px) {
    width: 100vw;
  }

  .monaco-editor-background {
    background-color: var(--color2);
  }

  .margin {
    background-color: var(--color2) !important;
  }

`;
