import LikeStar from "./LikeStar.tsx";
import DeleteButton from "./DeleteButton.tsx";
import ContentField from "./ContentField.tsx";
import type {Workshop} from "../utils/types.ts";

type Props = {
    workshop: Workshop;
}

export default function WorkshopDetail({workshop}: Props) {
    const articleAndChallenge = workshop.article.choices[0].message.content + "\n" + workshop.challenge.choices[0].message.content;

    return (<>
        <h2>Workshop</h2>
        <p>Language: {workshop.language}</p>
        <p>Topic: {workshop.topic}</p>
        <LikeStar workshop={workshop}/>
        <DeleteButton id={workshop.id}/>
        <ContentField content={articleAndChallenge}/>
    </>)
}
