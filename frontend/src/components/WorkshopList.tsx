import {useStore} from "../hooks/useStore.ts";
import {Workshop} from "../utils/types.ts";
import {useEffect} from "react";
import WorkshopPreview from "./WorkshopPreview.tsx";

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
            <a href={"/create"}>Create Workshop</a>
            {workshops.map((workshop: Workshop) => {
                return (
                    <WorkshopPreview key={"preview" + workshop.id} workshop={workshop}/>
                )
            })}
        </>
    )
}
