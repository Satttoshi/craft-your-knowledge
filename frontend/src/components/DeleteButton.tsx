import {useStore} from "../hooks/useStore.ts";
import styled from "@emotion/styled";
import React from "react";
import {IconButton} from "@mui/material";
import {Delete, CheckCircle, HighlightOff} from "@mui/icons-material";

type Props = {
    id: string
}

export default function DeleteButton({id}: Props) {
    const isLoggedIn = useStore(state => state.isLoggedIn);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState<boolean>(false);

    const deleteWorkshop = useStore(state => state.deleteWorkshop);

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        setIsDeleteDialogOpen(true);
    }

    function handleYesClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        deleteWorkshop(id);
    }

    function handleNoClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        setIsDeleteDialogOpen(false);
    }

    if (isDeleteDialogOpen) return (<StyledContainer>
        <IconButton onClick={handleYesClick} aria-label="confirmDelete">
            <CheckCircle className="iconYes"/>
        </IconButton>
        <IconButton onClick={handleNoClick} aria-label="denyDelete">
            <HighlightOff className="iconNo"/>
        </IconButton>
    </StyledContainer>)

    return (<StyledContainer>
        {
            isLoggedIn() &&
            <IconButton onClick={handleClick} aria-label="delete">
                <Delete/>
            </IconButton>
        }
    </StyledContainer>)
}

const StyledContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0.5rem;
  right: 1rem;

  .iconYes {
    color: green;
  }
  .iconNo {
    color: red;
  }
`;
