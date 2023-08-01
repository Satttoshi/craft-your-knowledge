import LikeStar from "./LikeStar.tsx";
import DeleteButton from "./DeleteButton.tsx";
import type {Workshop} from "../utils/types.ts";

type Props = {
    workshop: Workshop;
}

export default function WorkshopPreview({workshop}: Props) {
    return (<>
        <h2>Workshop</h2>
        <p>Language: {workshop.language}</p>
        <p>Topic: {workshop.topic}</p>
        <LikeStar workshop={workshop}/>
        <DeleteButton id={workshop.id}/>
    </>)
}
