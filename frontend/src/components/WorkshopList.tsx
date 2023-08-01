import {useStore} from "../hooks/useStore.ts";
import {Workshop} from "../utils/types.ts";
import {useEffect} from "react";
import LikeStar from "./LikeStar.tsx";
import DeleteButton from "./DeleteButton.tsx";
import ContentField from "./ContentField.tsx";

export default function WorkshopList() {
    const workshops = useStore(state => state.workshops);
    const isReadingWorkshops = useStore(state => state.isReadingWorkshops);
    const readWorkshops = useStore(state => state.readWorkshops);

    useEffect(readWorkshops, [readWorkshops]);

    if (isReadingWorkshops) {
        return <h2>Loading...</h2>
    }

    return (
        <>
            <h3>Workshops</h3>
            {workshops.map((workshop: Workshop) => {
                const articleAndChallenge = workshop.article.choices[0].message.content + "\n" + workshop.challenge.choices[0].message.content;

                return (
                    <div key={workshop.id + "_list"}>
                        <h2>Workshop</h2>
                        <p>Language: {workshop.language}</p>
                        <p>Topic: {workshop.topic}</p>
                        <LikeStar workshop={workshop}/>
                        <DeleteButton id={workshop.id}/>
                        <ContentField content={articleAndChallenge}/>
                    </div>
                )
            })}
        </>
    )
}
