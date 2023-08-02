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
            <span>{progressStatus}</span>
            <LikeStar workshop={workshop}/>
            <DeleteButton id={workshop.id}/>
        </StyledPreviewContainer>
    )
}

const StyledPreviewContainer = styled.article`
  width: 35vw;
  
  background-color: var(--color2);
  border-radius: 10px;
  padding: 1.5rem;
  
  
  border: 1px solid red;
  font-family: var(--fontSans);
  color: var(--colorWhite);
`;

const StyledLanguage = styled.p`
  font-family: var(--fontSans);
  color: var(--colorWhite);
  font-size: 1.5rem;
  text-align: center;

  height: 2rem;
  background: var(--color3);
  border-radius: 10px;
  box-shadow: var(--shadow2);
`;

const StyledTopic = styled.h2`
  font-family: var(--fontCode);
  color: var(--color-white);
  font-size: 1.7rem;
  font-weight: 500;
  margin: 0;

`;

const StyledBuzzword = styled.span`
  font-family: var(--fontSans);
  color: var(--color4)
`;
