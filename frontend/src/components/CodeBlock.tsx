import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";
import styled from "@emotion/styled";

type Props = {
    inline?: boolean;
    className: string;
    children: React.ReactNode;
};

export function CodeBlock({ inline, className, children, ...props }: Props) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (

        <StyledCodeBlock
            {...props}
            children={String(children).replace(/\n$/, "")}
            style={coldarkDark}
            language={match[1]}
            PreTag="div"
            showLineNumbers={false}
            customStyle={CustomStyle}
        />
    ) : (
        <StyledCode {...props} className={className}>
            {children}
        </StyledCode>
    );
}

const StyledCodeBlock = styled(SyntaxHighlighter)`
    border-radius: 10px;
`;

const CustomStyle = {
    backgroundColor: "var(--color1)",
    fontFamily: "var(--fontCode)",
    fontSize: "0.8rem",
}

const StyledCode= styled.code`
    background-color: var(--color1);
    color: var(--color4);
    font-family: var(--fontCode);
    padding: 0 0.2rem;
    border-radius: 3px;
`;
