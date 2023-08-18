import styled from "@emotion/styled";

type Props = {
    randomText: string;
}

export default function FormArticle({randomText} : Props) {

    return <StyledArticle>
        <p>{randomText}
        </p><h2>Imagine...</h2>
    </StyledArticle>
}

const StyledArticle = styled.article`
  font-family: var(--fontSans);
  color: var(--colorWhite);
  width: 50vw;
  min-width: 20rem;
  max-width: 30rem;

  h2 {
    color: var(--color5);
    margin-bottom: 2rem;
  }

  p {
    font-weight: 300;
    font-style: italic;
    color: gray;
    margin-top: 0;
  }
`;
