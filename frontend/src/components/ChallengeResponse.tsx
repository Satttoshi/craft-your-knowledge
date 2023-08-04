import successAnimation from "../assets/animations/success.json";
import failAnimation from "../assets/animations/fail.json";
import Button from "@mui/material/Button";
import styled from "@emotion/styled";
import Lottie from "lottie-react";

type Props = {
    challengeResponse: string | undefined;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
}

export default function ChallengeResponse({challengeResponse, isModalOpen, setIsModalOpen}: Props) {

    if (!challengeResponse) return null;

    return <>{challengeResponse.includes(">>>PASS<<<") ?
        <>
            <StyledLottieAnimation animationData={successAnimation} loop={false}/>
            <h3>Good Job! you solved the challenge!</h3>
        </>
        :
        <>
            <StyledLottieAnimation animationData={failAnimation} loop={false}/>
            <h3>Your approach seems to be incorrect</h3>
        </>
    }<Button onClick={() => setIsModalOpen(!isModalOpen)} variant="contained">Show Details</Button></>

}

const StyledLottieAnimation = styled(Lottie)`
  width: 4rem;
`;
