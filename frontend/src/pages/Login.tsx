import {TextField, IconButton, InputAdornment, Button} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from "@emotion/styled";
import {FormEvent, useState} from "react";
import {useStore} from "../hooks/useStore.ts";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const login = useStore(state => state.login);
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            await login(username, password, navigate);
        } catch (error) {
            console.error(error);
            alert("Wrong Credentials, please try again.");
            setUsername("");
            setPassword("");
        }
    }

    return (<>
        <StyledForm onSubmit={handleSubmit}>
            <h2>Login</h2>
            <TextField
                id="login-username"
                label="Username"
                variant="outlined"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <TextField
                id="login-adornment-password"
                label="Password"
                variant="outlined"
                value={password}
                type={showPassword ? 'text' : 'password'}
                onChange={e => setPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Button variant="contained" color="primary" type="submit">
                Submit
            </Button>
        </StyledForm>

    </>)
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem
`;
