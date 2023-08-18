import {useStore} from "../hooks/useStore.ts";
import {PersonalStatus, Workshop} from "../utils/types.ts";
import Tooltip from "@mui/material/Tooltip";
import React, {useState} from "react";
import styled from "@emotion/styled";

type Props = {
    workshop: Workshop;
}

function resolvePersonalStatus(workshop: Workshop, username: string): boolean {
    const isLiked = workshop.personalStatuses.find((status: PersonalStatus) => status.user.username === username)?.isLiked;
    return isLiked ?? false;
}

export default function LikeStar({workshop}: Props) {

    const likeAndUnlikeWorkshop = useStore(state => state.likeAndUnlikeWorkshop);
    const [isLiked, setIsLiked] = useState<boolean>(resolvePersonalStatus(workshop, useStore(state => state.username)));
    const [currentLikes, setCurrentLikes] = useState<number>(workshop.likes);
    const isLoggedIn = useStore(state => state.isLoggedIn)();
    const username = useStore(state => state.username);

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();

        if (!isLoggedIn) {
            return;
        }

        const personalStatus = workshop.personalStatuses.find(status => status.user.username === username);

        if (!personalStatus) {
            likeAndUnlikeWorkshop(workshop.id)
            setIsLiked(!isLiked);
            setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);
            return;
        }

        likeAndUnlikeWorkshop(workshop.id)
        setIsLiked(!isLiked);
        setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);
    }

    return (<>
        <Tooltip title="You need to be logged in to like a workshop!" disableHoverListener={isLoggedIn}>
            <StyledSpan>
        <StyledButton onClick={handleClick} variant={isLoggedIn}>
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
                         fill="gray">
                        <title>star-outline</title>
                        <path
                            d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z"/>
                    </svg>
            }<span>{currentLikes}</span>
        </StyledButton>
                </StyledSpan>
        </Tooltip>
    </>)
}

const StyledSpan = styled.span`
  position: absolute;
    bottom: 1rem;
    right: 2rem;
`;

type StyledButtonProps = {
    variant: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  background: none;
  border: none;
  cursor: ${props => props.variant ? "pointer" : "default"};
  padding: 0;

  color: var(--colorWhite);
  font-family: var(--fontSans);
  position: absolute;
  bottom: 0;
  right:0;
`;
