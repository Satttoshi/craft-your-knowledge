type Props = {
    id: string
}

export default function DeleteButton({id}: Props){

    function handleClick(){
        console.log("Delete button clicked");
    }

    return(
            <button onClick={handleClick}>Delete</button>
    )
}
