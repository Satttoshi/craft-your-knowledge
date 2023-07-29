import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";
import styled from "@emotion/styled";

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
            style={coldarkDark}
            language={match[1]}
            PreTag="div"
            showLineNumbers={true}
            customStyle={{backgroundColor: "var(--color1)", fontFamily: "var(--fontCode)", padding: "1rem 0.2rem"}}
        />
    ) : (
        <StyledCode {...props} className={className}>
            {children}
        </StyledCode>
    );
}

const StyledCode= styled.code`
    background-color: var(--color1);
    color: var(--color5);
    font-family: var(--fontCode);
    padding: 0 0.2rem;
`;
