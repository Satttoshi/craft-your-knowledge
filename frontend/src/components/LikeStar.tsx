import {useStore} from "../hooks/useStore.ts";
import {Workshop} from "../utils/types.ts";
import {useState} from "react";
import styled from "@emotion/styled";

type Props = {
    workshop: Workshop;
}

export default function LikeStar({workshop}: Props) {

    const updatePersonalStatus = useStore(state => state.updatePersonalStatus);
    const [isLiked, setIsLiked] = useState<boolean>(workshop.personalStatuses[0]?.isLiked);

    function handleClick() {

        if (!workshop.personalStatuses[0]) {
            updatePersonalStatus(workshop.id, {
                user: {
                    id: "1",
                    name: "Default User",
                },
                progressStatus: "NOT_STARTED",
                isLiked: true
            })
            setIsLiked(!isLiked);
            return;
        }

        const newPersonalStatus = {
            ...workshop.personalStatuses[0],
            isLiked: !isLiked,
        }
        updatePersonalStatus(workshop.id, newPersonalStatus)
        setIsLiked(!isLiked);
    }

    return (<>
        <StyledButton onClick={handleClick}>
            {
                isLiked ?

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36px" height="36px"
                         fill="orange">
                        <title>star</title>
                        <path
                            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36px" height="36px"
                         fill="orange">
                        <title>star-outline</title>
                        <path
                            d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z"/>
                    </svg>
            }<span>0</span>
        </StyledButton>

    </>)
}

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  color: var(--colorWhite);
  font-family: var(--fontSans);
  position: absolute;
  bottom: 1.7rem;
  right: 2rem;
`;
