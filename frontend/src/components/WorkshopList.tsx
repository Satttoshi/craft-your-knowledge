import {useStore} from "../hooks/useStore.ts";
import {Workshop} from "../utils/types.ts";
import {useEffect} from "react";
import WorkshopPreview from "./WorkshopPreview.tsx";
import styled from "@emotion/styled";
import UserInfo from "./UserInfo.tsx";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

export default function WorkshopList() {
    const workshops = useStore(state => state.workshops);
    const isReadingWorkshops = useStore(state => state.isReadingWorkshops);
    const readWorkshops = useStore(state => state.readWorkshops);
    const isLoggedIn = useStore(state => state.isLoggedIn);

    useEffect(readWorkshops, [readWorkshops]);

    if (isReadingWorkshops) {
        return null;
    }

    return (
        <>
            <StyledHeader>
                <h1>Craft Your Knowledge</h1>
                <UserInfo/>
            </StyledHeader>
            <StyledTitleContainer>
                <h3>Available workshops to explore</h3>
                {isLoggedIn() ?
                    <Link to="/create"><Button variant="contained">Create Workshop</Button></Link>
                    :
                    <Tooltip title="You need to be logged in to create a workshop">
                <span>
            <Button disabled variant="contained">Create Workshop</Button>
                </span>
                    </Tooltip>
                }
            </StyledTitleContainer>
            <StyledContainer>
                {workshops.map((workshop: Workshop) => {
                    return (
                        <WorkshopPreview key={"preview" + workshop.id} workshop={workshop}/>
                    )
                })}
            </StyledContainer>
        </>
    )
}

const StyledContainer = styled.section`
  width: 80vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 768px) {
    width: 90vw;
  }
`;

const StyledTitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 80vw;
  gap: 1rem;
  margin: 2rem 0;
  background: var(--color3);
  border-radius: 10px;
  padding: 1rem 2rem;

  h3 {
    margin: 0;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    width: 90vw;
  }
`;

const StyledHeader = styled.header`
  display: flex;
  width: 80vw;
  align-items: center;
  justify-content: space-between;
  position: relative;

  h1 {
    margin: 0;
    font-family: var(--fontCode);
    font-weight: 300;
    text-align: center;

    font-size: clamp(1.2rem, 4.5vw, 3rem);
    white-space: nowrap;
    flex: 1;
  }

  .userInfo {
    position: absolute;
    right: 0;
  }

  button {
    height: 2rem;
  }

  @media (max-width: 768px) {
    margin: 1rem 0;
    width: 90vw;
    h1 {
      text-align: left;
    }
  }
`;
