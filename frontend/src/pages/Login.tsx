import {TextField, IconButton, InputAdornment, Button} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from "@emotion/styled";
import {FormEvent, useState} from "react";
import {useStore} from "../hooks/useStore.ts";
import {Link, useNavigate, useLocation} from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [repeatPassword, setRepeatPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const login = useStore(state => state.login);
    const register = useStore(state => state.register);
    const navigate = useNavigate();
    const isRegister = useLocation().pathname === "/register";

    async function handleSubmit(event: FormEvent<HTMLFormElement>, isRegister: boolean): Promise<void> {
        event.preventDefault();

        if (isRegister) {
            try {
                await register(username, password, repeatPassword, navigate);
            } catch (error) {
                console.error(error);
                alert("Wrong Credentials, please try again.");
                setUsername("");
                setPassword("");
                setRepeatPassword("");
            }
        }

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
        <StyledForm onSubmit={e => handleSubmit(e, isRegister)}>
            {isRegister ? <h2>Register</h2> : <h2>Login</h2>}
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
            {
                isRegister && <TextField
                    id="register-password"
                    label="Repeat Password"
                    variant="outlined"
                    value={repeatPassword}
                    type={showPassword ? 'text' : 'password'}
                    onChange={e => setRepeatPassword(e.target.value)}
                />}
            <Button variant="contained" color="primary" type="submit">
                Submit
            </Button>
        </StyledForm>
        {
            isRegister ?
                <span>Already have an account?<Link to="/login">Login</Link></span>
                :
                <span>Don't have an account? <Link to="/register">Register</Link></span>
        }

    </>)
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem
`;
