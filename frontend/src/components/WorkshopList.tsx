import {useStore} from "../hooks/useStore.ts";
import {Workshop} from "../utils/types.ts";
import {useEffect} from "react";
import WorkshopPreview from "./WorkshopPreview.tsx";
import styled from "@emotion/styled";

export default function WorkshopList() {
    const workshops = useStore(state => state.workshops);
    const isReadingWorkshops = useStore(state => state.isReadingWorkshops);
    const readWorkshops = useStore(state => state.readWorkshops);

    useEffect(readWorkshops, [readWorkshops]);

    if (isReadingWorkshops) {
        return <h2>Loading...</h2>
    }

    return (
        <>
            <h3>Workshops</h3>
            <a href={"/create"}>Create Workshop</a>
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
