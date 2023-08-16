import {useStore} from "../hooks/useStore.ts";
import styled from "@emotion/styled";
import React from "react";

type Props = {
    id: string
}

export default function DeleteButton({id}: Props) {

    const deleteWorkshop = useStore(state => state.deleteWorkshop);

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        deleteWorkshop(id);
    }

    return (
        <StyledDeleteButton onClick={(event) => handleClick(event)}>Delete</StyledDeleteButton>
    )
}

const StyledDeleteButton = styled.button`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 10px;
`;
