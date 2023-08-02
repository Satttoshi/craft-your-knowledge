import Editor from '@monaco-editor/react';

type Props = {
    language: string;
}

export default function CodeEditor({language}: Props) {

    const editorLanguage = language.toLowerCase();

    return <Editor height="90vh" defaultLanguage={editorLanguage} defaultValue="" />
}
