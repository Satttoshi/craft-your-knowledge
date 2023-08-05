import successAnimation from "../assets/animations/success.json";
import failAnimation from "../assets/animations/fail.json";
import styled from "@emotion/styled";
import Lottie from "lottie-react";

type Props = {
    challengeResponse: string | undefined;
}

export default function ChallengeResponse({challengeResponse}: Props) {

    if (!challengeResponse) return null;

    return <StyledContainer>{challengeResponse.includes(">>>PASS<<<") ?
        <>
            <StyledLottieAnimation animationData={successAnimation} loop={false}/>
            <h3>Good Job! you solved the challenge!</h3>
        </>
        :
        <>
            <StyledLottieAnimation animationData={failAnimation} loop={false}/>
            <h3>Your approach seems to be incorrect</h3>
        </>
    }</StyledContainer>

}

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 2rem;

  h3 {
    white-space: nowrap;
    margin-right: 1rem;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1rem;
    }
  }
`;

const StyledLottieAnimation = styled(Lottie)`
  width: 3rem;
  min-width: 3rem;
  transform: translateY(0.2rem);

  @media (max-width: 768px) {
    width: 2rem;
    min-width: 2rem;
  }
`;
