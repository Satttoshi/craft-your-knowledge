import {FormEvent, useState} from "react";
import {Autocomplete, Chip, TextField, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {Save} from "@mui/icons-material";
import styled from "@emotion/styled";
import {useStore} from "../hooks/useStore.ts";
import {WorkshopFormData} from "../utils/types.ts";

export default function CreateForm() {
    const [language, setLanguage] = useState<string>("")
    const [topic, setTopic] = useState<string>("");
    const [buzzWords, setBuzzWords] = useState<string[]>([]);

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
    }

    return (<>
        <StyledForm onSubmit={handleSubmit}>

            <FormControl fullWidth>
                <InputLabel htmlFor="language">Language</InputLabel>
                <Select
                    labelId="language"
                    id="language"
                    value={language}
                    label="Language"
                    onChange={(e) => setLanguage(e.target.value as string)}
                >
                    <MenuItem value={"JAVASCRIPT"}>JavaScript</MenuItem>
                    <MenuItem value={"JAVA"}>Java</MenuItem>
                    <MenuItem value={"PYTHON"}>Python</MenuItem>
                    <MenuItem value={"C"}>C</MenuItem>
                    <MenuItem value={"CSHARP"}>C#</MenuItem>
                </Select>
            </FormControl>

            <StyledTextField
                id="topicInput"
                name="topic"
                label="Topic"
                value={topic}
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
                startIcon={<Save />}
                variant="contained"
            >
                <span>Save</span>
            </StyledButton>

        </StyledForm>
    </>)
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80vw;
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
