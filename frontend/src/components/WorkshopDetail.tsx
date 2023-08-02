import LikeStar from "./LikeStar.tsx";
import DeleteButton from "./DeleteButton.tsx";
import ContentField from "./ContentField.tsx";



export default function WorkshopDetail() {


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
