import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import {useStore} from "../hooks/useStore.ts";
import styled from "@emotion/styled";

export default function ListHeader() {
    const isLoggedIn = useStore(state => state.isLoggedIn);

    return <StyledTitleContainer>
        <h3>Available workshops to explore</h3>
        {isLoggedIn() ?
            <Link to="/create"><Button variant="contained" size="large">CRAFT</Button></Link>
            :
            <Tooltip title="You need to be logged in to craft a workshop">
                        <span>
                            <Button disabled variant="contained" size="large">CRAFT</Button>
                        </span>
            </Tooltip>
        }
    </StyledTitleContainer>
}

const StyledTitleContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 80vw;
  gap: 1rem;
  margin: 2rem 0;
  background: var(--color3);
  border-radius: 10px;
  padding: 1rem 2rem;
  height: 4rem;
  box-shadow: var(--shadow1);

  h3 {
    margin: 0;
    white-space: nowrap;
    font-size: clamp(0.95rem, 1.5vw, 1.5rem);
    font-weight: 300;
    @media (max-width: 768px) {
      font-size: clamp(1.2rem, 3vw, 1.5rem);
    }
  }

  span {
    display: grid;
    place-items: center;

    @media (min-width: 769px) {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      button {
        width: clamp(5rem, 10vw, 15rem);
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    width: 90vw;
    height: auto;
  }
`;
