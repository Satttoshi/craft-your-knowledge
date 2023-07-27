export default function DeleteButton(){

    function handleClick(){
        console.log("Delete button clicked");
    }

    return(
            <button onClick={handleClick}>Delete</button>
    )
}