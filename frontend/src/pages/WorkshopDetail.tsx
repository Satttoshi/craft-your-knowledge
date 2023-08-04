import ContentField from "../components/ContentField.tsx";
import {useParams, useNavigate} from "react-router-dom";
import {useStore} from "../hooks/useStore.ts";
import NotFound from "../pages/NotFound.tsx";
import CodeEditor from "../components/CodeEditor.tsx";
import styled from "@emotion/styled";
import Button from '@mui/material/Button';
import {ReactComponent as User} from "../assets/user.svg";
import {ReactComponent as Back} from "../assets/back.svg";

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
            <StyledBackButton onClick={handleBack} variant="outlined">
                <Back/>
            </StyledBackButton>
            <StyledTitle>Workshop</StyledTitle>
            <StyledUserInfo><User/>
                <p>Default User</p></StyledUserInfo>

        </StyledBanner>
        <StyledMain>
            <ContentField content={articleAndChallenge}/>
            <CodeEditor workshop={currentWorkshop}/>
        </StyledMain>
{/*        <LikeStar workshop={currentWorkshop}/>
        <DeleteButton id={currentWorkshop.id}/>*/}
    </>)
}

const StyledBanner = styled.div`

  position: fixed;
  top: 0;
  border-radius: 0 0 10px 10px;
  width: 96vw;
  background-color: var(--color2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 3rem;

  h2 {
    margin: 0;

  }

`;

const StyledBackButton = styled(Button)`

  width: 5rem;
  padding: 0;

  svg {
    width: 2rem;
    height: 2rem;
    fill: var(--color4);
    padding: 0;
  }

`;

const StyledTitle = styled.h2`

  font-family: var(--fontCode);
  font-size: 1.7rem;
  font-weight: 300;
`;

const StyledUserInfo = styled.div`

  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    width: 2rem;
    height: 2rem;
    fill: var(--color4);
  }

  p {
    margin: 0;
    padding: 0;
  }
`;

const StyledMain = styled.main`
  margin-top: 3.5rem;
  width: 96vw;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 1rem;
  position: fixed;
  bottom: 0;
`;
