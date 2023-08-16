import ContentField from "../components/ContentField.tsx";
import {useParams, useNavigate} from "react-router-dom";
import {useStore} from "../hooks/useStore.ts";
import NotFound from "../pages/NotFound.tsx";
import CodeEditor from "../components/CodeEditor.tsx";
import styled from "@emotion/styled";
import Button from '@mui/material/Button';
import {ReactComponent as Back} from "../assets/back.svg";
import UserInfo from "../components/UserInfo.tsx";

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
            <UserInfo/>
        </StyledBanner>
        <StyledMain>
            <ContentField content={articleAndChallenge}/>
            <CodeEditor workshop={currentWorkshop}/>
        </StyledMain>
    </>)
}

const StyledBanner = styled.div`
  position: fixed;
  height: 6vh;

  top: 0;
  border-radius: 0 0 10px 10px;
  width: 96vw;
  background-color: var(--color2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1vh 3rem;
  box-shadow: var(--shadow1);
  
  z-index: 200;

  h2 {
    margin: 0;
  }

  @media (max-width: 768px) {
    border-radius: 0;
    width: 100vw;
    height: 8vh;
    padding: 1vh 3vw;
    h2 {
      display: none;
    }
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

const StyledMain = styled.main`
  @media (min-width: 769px) {
    bottom: 0;
    position: fixed;
    width: 96vw;
  }
  
  margin-top: 3.5rem;
  
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 1rem;
  align-items: end;
  
  @media (max-width: 768px) {
    margin-top: 8vh;
    grid-template-columns: 1fr;
    width: 100vw;
  }
`;
