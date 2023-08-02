import LikeStar from "./LikeStar.tsx";
import DeleteButton from "./DeleteButton.tsx";
import type {Workshop} from "../utils/types.ts";
import styled from "@emotion/styled";

type Props = {
    workshop: Workshop;
}

export default function WorkshopPreview({workshop}: Props) {

    function formatProgressStatusEnum(progressStatus: string) {
        if (!progressStatus) return "";
        return progressStatus.replace(/_/g, " ").toLowerCase();
    }

    const progressStatus = formatProgressStatusEnum(workshop.personalStatuses[0]?.progressStatus)



    return (
        <StyledPreviewContainer>
            <StyledLanguage>{workshop.language}</StyledLanguage>
            <StyledTopic>{workshop.topic}</StyledTopic>
            {workshop.buzzWords.map((buzzWord: string, index: number) => {
                return <StyledBuzzword
                    key={workshop.id + buzzWord}>{index < workshop.buzzWords.length - 1 ? buzzWord + ", " : buzzWord}</StyledBuzzword>
            })}
            <StyledStatus>{progressStatus ? progressStatus : "not started"}</StyledStatus>
            <LikeStar workshop={workshop}/>
            <DeleteButton id={workshop.id}/>
        </StyledPreviewContainer>
    )
}

const StyledPreviewContainer = styled.article`
  margin: 2rem 0;
  
  position: relative;
  width: 38vw;
  height: 200px;
  background-color: var(--color2);
  border-radius: 10px;
  padding: 3rem 1.5rem 1.5rem 1.5rem;
  
  font-family: var(--fontSans);
  color: var(--colorWhite);
  box-shadow: var(--shadow1);
  
  @media (max-width: 768px) {
    width: 90vw;
    height: 220px;
  }
`;

const StyledLanguage = styled.p`
  font-family: var(--fontSans);
  color: var(--colorWhite);
  font-size: 1.5rem;
  text-align: center;

  padding-top: 0.5rem;
  height: 3rem;
  width: 12rem;
  background: var(--color3);
  border-radius: 10px;
  box-shadow: var(--shadow2);
  margin: 0;
  
  position: absolute;
  top: -1.5rem;
`;

const StyledTopic = styled.h2`
  font-family: var(--fontCode);
  color: var(--color-white);
  font-size: 1.7rem;
  font-weight: 500;
  margin: 0;
`;

const StyledBuzzword = styled.span`
  font-family: var(--fontCode);
  color: var(--color4);
  font-size: 1rem;
`;

const StyledStatus = styled.span`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
`;
