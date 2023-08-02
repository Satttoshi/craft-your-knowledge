import Editor from '@monaco-editor/react';
import {useState} from "react";

type Props = {
    language: string;
}

export default function CodeEditor({language}: Props) {
    const [code, setCode] = useState<string | undefined>("// start coding here ...");

    const editorLanguage = language.toLowerCase();

    return <form><Editor
        height="80vh"
        width="60vw"
        theme="hc-black"
        defaultLanguage={editorLanguage}
        defaultValue="// start coding here ..."
        onChange={(value) => setCode(value)}
    />
    </form>

}
