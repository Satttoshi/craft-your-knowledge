import {useStore} from "../hooks/useStore.ts";
import {Workshop} from "../utils/types.ts";
import {useEffect} from "react";

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
                return (
                    <div key={workshop.id + "_list"}>
                        <h2>Workshop</h2>
                        <p>Language: {workshop.topic}</p>
                        <p>Topic: {workshop.subTopic}</p>
                        <p>Difficulty: {workshop.difficulty}</p>
                        <p>Time: {workshop.estimatedTimeToMaster}</p>
                    </div>
                )
            })}
        </>
    )
}
