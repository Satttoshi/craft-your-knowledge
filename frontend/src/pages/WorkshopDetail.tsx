import LikeStar from "../components/LikeStar.tsx";
import DeleteButton from "../components/DeleteButton.tsx";
import ContentField from "../components/ContentField.tsx";
import {useParams} from "react-router-dom";
import {useStore} from "../hooks/useStore.ts";
import NotFound from "../pages/NotFound.tsx";

export default function WorkshopDetail() {

    const urlParams = useParams();
    const getWorkshopById = useStore((state) => state.getWorkshopById);
    const readWorkshopById = useStore((state) => state.readWorkshopById);
    const fetchedWorkshop = useStore((state) => state.workshop);

    let currentWorkshop;
    try {
        currentWorkshop = getWorkshopById(urlParams.id as string);
    } catch (e) {
        try {
            readWorkshopById(urlParams.id as string);
            currentWorkshop = fetchedWorkshop;
        } catch (e) {
            console.log(e);
        }
    }

    if (!currentWorkshop) {
        return <NotFound/>
    }

    const articleAndChallenge = currentWorkshop.article.choices[0].message.content + "\n" + currentWorkshop.challenge.choices[0].message.content;

    return (<>
        <h2>Workshop</h2>
        <p>Language: {currentWorkshop.language}</p>
        <p>Topic: {currentWorkshop.topic}</p>
        <LikeStar workshop={currentWorkshop}/>
        <DeleteButton id={currentWorkshop.id}/>
        <ContentField content={articleAndChallenge}/>
    </>)
}
