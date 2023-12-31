import {FormEvent, useState} from "react";
import {Autocomplete, Chip, TextField, FormControl, InputLabel, Select, MenuItem, Button} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {Save} from "@mui/icons-material";
import styled from "@emotion/styled";
import {useStore} from "../hooks/useStore.ts";
import {WorkshopFormData} from "../utils/types.ts";
import GearsLoading from "./GearsLoading.tsx";
import {useNavigate} from "react-router-dom";
import UserInfo from "./UserInfo.tsx";
import {ReactComponent as Back} from "../assets/back.svg";
import programmingLanguages from "../utils/programmingLanguages.ts";
import FormArticle from "./FormArticle.tsx";

type Props = {
    randomText: string;
}

export default function CreateForm({randomText}: Props) {
    const [language, setLanguage] = useState<string>("")
    const [topic, setTopic] = useState<string>("");
    const [buzzWords, setBuzzWords] = useState<string[]>([]);

    const navigate = useNavigate();
    const createWorkshop = useStore(state => state.createWorkshop);
    const isCreatingWorkshop = useStore(state => state.isCreatingWorkshop);

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        const workshopFormData: WorkshopFormData = {
            language,
            topic,
            buzzWords
        }
        createWorkshop(workshopFormData)
            .then((workshop) => {
                navigate(`/workshop/${workshop.id}`)
            })
            .catch(error => console.log(error))
    }

    function handleBack() {
        navigate("/");
    }

    return (<>

        {isCreatingWorkshop && (<>
            <StyledLoadingHeader>Generating...</StyledLoadingHeader>
            <GearsLoading/>
        </>)}

        {!isCreatingWorkshop && <>
            <StyledHeader>
                <StyledBackButton className="backButton" onClick={handleBack} variant="outlined">
                    <Back/>
                </StyledBackButton>
                <h1>Craft Your Knowledge</h1>
                <UserInfo/>
            </StyledHeader>
            <FormArticle randomText={randomText}/>
            <StyledForm onSubmit={handleSubmit}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="language">Language</InputLabel>
                    <Select
                        labelId="language"
                        id="language"
                        value={language}
                        required
                        label="Language"
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        {
                            programmingLanguages.map((language) => {
                                return <MenuItem key={"keyId:" + language} value={language}>{language}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>

                <StyledTextField
                    id="topicInput"
                    name="topic"
                    label="Topic"
                    value={topic}
                    required
                    onChange={(e) => setTopic(e.target.value)}
                />

                <StyledAutocomplete
                    multiple
                    id="tags-filled"
                    options={buzzWords}
                    freeSolo
                    value={buzzWords}
                    onChange={(_, buzzWords) => {
                        setBuzzWords(buzzWords as string[]);
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                            const tagProps = getTagProps({index});
                            return (
                                <Chip
                                    variant="outlined"
                                    label={option as string}
                                    {...tagProps}
                                />
                            );
                        })
                    }
                    renderInput={(params) => (
                        <TextField {...params} variant="filled" label="Buzzwords"/>
                    )}
                />
                <StyledButton
                    type="submit"
                    color="primary"
                    loading={isCreatingWorkshop}
                    loadingPosition="start"
                    startIcon={<Save/>}
                    variant="contained"
                >
                    <span>CRAFT</span>
                </StyledButton>
            </StyledForm>
        </>}

    </>)
}

const StyledHeader = styled.header`
  display: flex;
  width: 80vw;
  margin: 2rem 0 3rem 0;
  align-items: center;
  justify-content: space-between;
  position: relative;

  .backButton {
    position: absolute;
    left: 0;
  }

  .userInfo {
    position: absolute;
    right: 0;
  }

  h1 {
    margin: 0;
    font-family: var(--fontCode);
    font-weight: 300;
    text-align: center;

    font-size: clamp(1.1rem, 4.3vw, 3rem);
    white-space: nowrap;
    flex: 1;
  }

  @media (max-width: 768px) {
    h1 {
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

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50vw;
  min-width: 20rem;
  max-width: 30rem;
  gap: 2rem;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

const StyledAutocomplete = styled(Autocomplete)`
  width: 100%;
`;

const StyledButton = styled(LoadingButton)`
  width: 100px;
`;

const StyledLoadingHeader = styled.h2`
  font-family: var(--fontCode);
  color: var(--colorWhite);
`;
