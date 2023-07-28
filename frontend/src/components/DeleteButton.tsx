import {useStore} from "../hooks/useStore.ts";

type Props = {
    id: string
}

export default function DeleteButton({id}: Props){

    const deleteWorkshop = useStore(state => state.deleteWorkshop);

    function handleClick(){
        deleteWorkshop(id);
    }

    return(
            <button onClick={handleClick}>Delete</button>
    )
}
