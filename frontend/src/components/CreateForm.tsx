import {useState} from "react";
import {Autocomplete, Chip, TextField, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {Save} from "@mui/icons-material";
import styled from "@emotion/styled";
import {useStore} from "../hooks/useStore.ts";
import {WorkshopWithoutIdAndLikes} from "../utils/types.ts";

export default function CreateForm() {
    const [topic, setTopic] = useState<string>("")
    const [subTopic, setSubTopic] = useState<string>("");
    const [buzzWords, setBuzzWords] = useState<string[]>([]);
    const [estimatedTime, setEstimatedTime] = useState<number>(10);
    const [difficulty, setDifficulty] = useState<string>("EASY");

    const createWorkshop = useStore(state => state.createWorkshop);

    function handleSubmit(): void {
        const workshopWithoutIdAndLikes: WorkshopWithoutIdAndLikes = {
            topic,
            subTopic,
            buzzWords,
            estimatedTime,
            difficulty,
        }
        createWorkshop(workshopWithoutIdAndLikes)
    }

    return (<>
        <StyledForm onSubmit={handleSubmit}>
            <StyledTextField
                id="topicInput"
                name="topic"
                label="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
            />

            <StyledTextField
                id="subTopicInput"
                name="subTopic"
                label="Sub Topic"
                value={subTopic}
                onChange={(e) => setSubTopic(e.target.value)}
            />

            <StyledAutocomplete
                multiple
                id="tags-filled"
                options={buzzWords}
                freeSolo
                value={buzzWords}
                onChange={(_, buzzwords) => {
                    setBuzzWords(buzzwords);
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => {
                        const tagProps = getTagProps({index});
                        return (
                            <Chip
                                variant="outlined"
                                label={option}
                                {...tagProps}
                            />
                        );
                    })
                }
                renderInput={(params) => (
                    <TextField {...params} variant="filled" label="Buzzwords"/>
                )}
            />

            <FormControl fullWidth>
                <InputLabel htmlFor="estimated-time">Estimated Time to Complete</InputLabel>
                <Select
                    labelId="estimated-time"
                    id="estimated-time"
                    value={estimatedTime}
                    label="Estimated Time to Complete"
                    onChange={(e) => setEstimatedTime(e.target.value as number)}
                >
                    <MenuItem value={10}>10 Minutes</MenuItem>
                    <MenuItem value={20}>20 Minutes</MenuItem>
                    <MenuItem value={30}>30 Minutes</MenuItem>
                    <MenuItem value={60}>1 Hour</MenuItem>
                    <MenuItem value={120}>2 Hour</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel htmlFor="difficulty">Choose Difficulty</InputLabel>
                <Select
                    labelId="difficulty"
                    id="difficulty"
                    value={difficulty}
                    label="Choose Difficulty"
                    onChange={e => setDifficulty(e.target.value)}
                >
                    <MenuItem value={"EASY"}>Junior</MenuItem>
                    <MenuItem value={"MEDIUM"}>Senior</MenuItem>
                    <MenuItem value={"HARD"}>Dark Souls</MenuItem>
                </Select>
            </FormControl>

            <StyledButton
                color="primary"
                onClick={console.log}
                loading={false}
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
  width: 600px;
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