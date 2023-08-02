import {useStore} from "../hooks/useStore.ts";
import styled from "@emotion/styled";

type Props = {
    id: string
}

export default function DeleteButton({id}: Props){

    const deleteWorkshop = useStore(state => state.deleteWorkshop);

    function handleClick(){
        deleteWorkshop(id);
    }

    return(
            <StyledDeleteButton onClick={handleClick}>Delete</StyledDeleteButton>
    )
}

const StyledDeleteButton = styled.button`
    position: absolute;
    bottom: 0;
    right: 10px;

`;
