import Editor from '@monaco-editor/react';
import {FormEvent, useState} from "react";
import styled from "@emotion/styled";

type Props = {
    language: string;
}

export default function CodeEditor({language}: Props) {
    const [code, setCode] = useState<string | undefined>("// start coding here ...");

    const editorLanguage = language.toLowerCase();

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        console.log(code);
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
