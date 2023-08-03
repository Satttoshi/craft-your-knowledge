import LikeStar from "../components/LikeStar.tsx";
import DeleteButton from "../components/DeleteButton.tsx";
import ContentField from "../components/ContentField.tsx";
import {useParams, useNavigate} from "react-router-dom";
import {useStore} from "../hooks/useStore.ts";
import NotFound from "../pages/NotFound.tsx";
import CodeEditor from "../components/CodeEditor.tsx";
import styled from "@emotion/styled";
import Button from '@mui/material/Button';

export default function WorkshopDetail() {

    const urlParams = useParams();
    const getWorkshopById = useStore((state) => state.getWorkshopById);
    const readWorkshopById = useStore((state) => state.readWorkshopById);
    const fetchedWorkshop = useStore((state) => state.workshop);
    const navigate = useNavigate();

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

    function handleBack() {
        navigate(-1);
    }

    return (<>
        <StyledBanner>
            <Button onClick={handleBack} variant="outlined"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color4)"><path d="M21,11H6.83L10.41,7.41L9,6L3,12L9,18L10.41,16.58L6.83,13H21V11Z" /></svg></Button>
            <h2>Workshop</h2>
            <p>Language: {currentWorkshop.language}</p>
            <p>Topic: {currentWorkshop.topic}</p>
        </StyledBanner>
        <LikeStar workshop={currentWorkshop}/>
        <DeleteButton id={currentWorkshop.id}/>
        <ContentField content={articleAndChallenge}/>
        <CodeEditor workshop={currentWorkshop}/>
    </>)
}

const StyledBanner = styled.div`
  width: 95vw;
  background-color: var(--color3);
  border-radius: 10px;
  display: flex;

  h2 {
    margin: 0;
  }

  p {
    margin: 0;
  }




`;