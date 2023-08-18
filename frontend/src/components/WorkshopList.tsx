import {useStore} from "../hooks/useStore.ts";
import {useEffect} from "react";
import WorkshopPreview from "./WorkshopPreview.tsx";
import styled from "@emotion/styled";
import UserInfo from "./UserInfo.tsx";
import ListHeader from "./ListHeader.tsx";

export default function WorkshopList() {
    const workshops = useStore(state => state.workshops);
    const isReadingWorkshops = useStore(state => state.isReadingWorkshops);
    const readWorkshops = useStore(state => state.readWorkshops);

    useEffect(readWorkshops, [readWorkshops]);

    if (isReadingWorkshops) {
        return null;
    }

    const sortedWorkshops = [...workshops].sort((a, b) => b.likes - a.likes);

    return (
        <>
            <StyledHeader>
                <h1>Craft Your Knowledge</h1>
                <UserInfo/>
            </StyledHeader>
            <ListHeader/>
            <StyledContainer>
                {sortedWorkshops.map((workshop) => (
                    <WorkshopPreview key={"preview" + workshop.id} workshop={workshop} />
                ))}
            </StyledContainer>
        </>
    )
}

const StyledContainer = styled.section`
  width: 80vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
  @media (min-width: 1025px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    place-items: center;
    gap: 1rem;
  }

  @media (max-width: 768px) {
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

    font-size: clamp(1.1rem, 4.3vw, 3rem);
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
