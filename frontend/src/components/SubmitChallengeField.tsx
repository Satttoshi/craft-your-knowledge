import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import ChallengeResponse from "./ChallengeResponse.tsx";
import {FormEvent} from "react";
import styled from "@emotion/styled";
import scanningAnimation from "../assets/animations/scanning.json";
import Lottie from "lottie-react";
import {useStore} from "../hooks/useStore.ts";


type Props = {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    isValidatingChallenge: boolean;
    challengeResponse: string | undefined;
    setIsModalOpen: (isModalOpen: boolean) => void;
    isModalOpen: boolean;
    isUserInputLongEnough: boolean;
}

export default function SubmitChallengeField({handleSubmit, isValidatingChallenge, challengeResponse, setIsModalOpen, isModalOpen, isUserInputLongEnough}: Props) {
    const isLoggedIn = useStore(state => state.isLoggedIn)();

    return <StyledForm onSubmit={handleSubmit}>
        {isValidatingChallenge ?
            <StyledLottie animationData={scanningAnimation} loop={true}/>
            :
            <>
                <StyledButtonGroup>
                    <Tooltip title="You need to be logged in to check your challenge" disableHoverListener={isLoggedIn}>
                        <span>
                            <Button
                                type="submit"
                                color="secondary"
                                disabled={!isLoggedIn}
                                variant={isUserInputLongEnough ? "contained" : "outlined"}
                                endIcon={<LibraryAddCheckIcon/>}
                            >
                                Check Challenge
                            </Button>
                        </span>
                    </Tooltip>
                    {challengeResponse &&
                        <Button style={{width: "9rem", minWidth: "9rem"}}
                                onClick={() => setIsModalOpen(!isModalOpen)}
                                variant={isModalOpen ? "outlined" : "contained"}>
                            {isModalOpen ? "Hide Details" : "Show Details"}
                        </Button>}
                </StyledButtonGroup>
                <ChallengeResponse challengeResponse={challengeResponse}/>
            </>
        }
    </StyledForm>
}

const StyledLottie = styled(Lottie)`
  width: 7rem;
  height: 7rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const StyledForm = styled.form`
  padding: 0 2rem;
  background-color: var(--color2);
  overflow: hidden;
  border-radius: 10px;
  height: 15vh;
  margin-bottom: 2.5vh;
  box-shadow: var(--shadow1);

  position: relative;

  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  h3 {
    margin: 0 1rem 0 0;
    padding: 0;
  }

  @media (max-width: 768px) {
    height: 16vh;
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

  button {
    font-weight: bold;
  }

  @media (max-width: 768px) {
    scale: 0.9;
  }
`;
