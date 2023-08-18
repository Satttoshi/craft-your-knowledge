import LoadingButton from "@mui/lab/LoadingButton";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import Button from "@mui/material/Button";
import ChallengeResponse from "./ChallengeResponse.tsx";
import {FormEvent} from "react";
import styled from "@emotion/styled";

type Props = {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    isValidatingChallenge: boolean;
    challengeResponse: string | undefined;
    setIsModalOpen: (isModalOpen: boolean) => void;
    isModalOpen: boolean;
}

export default function SubmitChallengeField({handleSubmit, isValidatingChallenge, challengeResponse, setIsModalOpen, isModalOpen}: Props){

    return <StyledForm onSubmit={handleSubmit}>
        <StyledButtonGroup>
            <LoadingButton type="submit" color="secondary" loading={isValidatingChallenge} variant="outlined"
                           endIcon={<LibraryAddCheckIcon/>}>Check Challenge</LoadingButton>
            {challengeResponse &&
                <Button style={{width: "9rem", minWidth: "9rem"}}
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        variant={isModalOpen ? "outlined" : "contained"}>
                    {isModalOpen ? "Hide Details" : "Show Details"}
                </Button>}
        </StyledButtonGroup>
        <ChallengeResponse challengeResponse={challengeResponse}/>
    </StyledForm>
}

const StyledForm = styled.form`
  padding: 0 2rem;
  background-color: var(--color2);
  overflow: hidden;
  border-radius: 10px;
  height: 15vh;
  margin-bottom: 2.5vh;
  box-shadow: var(--shadow1);

  position: inherit;

  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  h3 {
    margin: 0 1rem 0 0;
    padding: 0;
  }

  .monaco-editor-background {
    background-color: var(--color2);
  }

  .margin {
    background-color: var(--color2) !important;
  }

  @media (max-width: 768px) {
    height: 18vh;
    margin-bottom: 0.5vh;
    border-radius: 0;
  }
`;

const StyledButtonGroup = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  gap: 1rem;
  height: 3rem;
  white-space: nowrap;
  
    @media (max-width: 768px) {
      scale: 0.9;
    }
`;
