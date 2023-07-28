import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";

type CodeBlockProps = {
    inline?: boolean;
    className: string;
    children: React.ReactNode;
};

export function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
        <SyntaxHighlighter
            {...props}
            children={String(children).replace(/\n$/, "")}
            style={materialDark}
            language={match[1]}
            PreTag="div"
        />
    ) : (
        <code {...props} className={className}>
            {children}
        </code>
    );
}
