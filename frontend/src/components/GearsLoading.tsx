import {ReactComponent as Cog} from "../assets/cog.svg";
import styled from "@emotion/styled";
import {keyframes} from "@emotion/react";

export default function GearsLoading() {
    return <StyledCogContainer>
        <StyledCog1/>
        <StyledCog2/>
        <StyledCog3/>
    </StyledCogContainer>
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledCogContainer = styled.div`
  position: relative;
  width: 250px;
  height: 170px;

`;

const StyledCog1 = styled(Cog)`
  fill: var(--color4);
  position: absolute;
  bottom: 11px;
  left: 20px;
  
  width: 100px;
  height: 100px;
  animation: ${spin} 3s linear infinite;
  scale: 0.8;
`;

const StyledCog2 = styled(Cog)`
  fill: var(--color4);
  position: absolute;
  bottom: 60px;
  left: 65px;

  width: 100px;
  height: 100px;
  animation: ${spin} 3s linear infinite reverse;
`;

const StyledCog3 = styled(Cog)`
  fill: var(--color4);
  position: absolute;
  bottom: 40px;
  right: 20px;
  scale: 0.8;
  
  width: 100px;
  height: 100px;
  animation: ${spin} 3s linear infinite;
`;
