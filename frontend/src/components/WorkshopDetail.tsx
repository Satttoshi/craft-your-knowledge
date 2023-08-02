import LikeStar from "./LikeStar.tsx";
import DeleteButton from "./DeleteButton.tsx";
import ContentField from "./ContentField.tsx";
import {useParams} from "react-router-dom";
import {useStore} from "../hooks/useStore.ts";
import NotFound from "../pages/NotFound.tsx";

export default function WorkshopDetail() {

    const urlParams = useParams();
    const getWorkshopById = useStore((state) => state.getWorkshopById);
    const currentWorkshop = getWorkshopById(urlParams.id as string);

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
