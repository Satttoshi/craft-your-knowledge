import {TextField, IconButton, InputAdornment, Button} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from "@emotion/styled";
import {ChangeEvent, FormEvent, useState} from "react";
import {useStore} from "../hooks/useStore.ts";
import {Link, useNavigate, useLocation} from "react-router-dom";
import PasswordValidator from "../utils/passwordValidator.ts";

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<string>("");
    const [repeatPassword, setRepeatPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isStrong, setIsStrong] = useState<boolean>(false);
    const [isValidRepeatPassword, setIsValidRepeatPassword] = useState<boolean>(false);
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

    function handlePassword(event: ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        const password = event.target.value;
        setPassword(password);

        if (isRegister) {
            const validator = new PasswordValidator(password);
            const validationState = validator.validate();
            const validationMessage = validator.getValidationMessage(validationState);
            const strong = validator.isStrong()
            setErrors(validationMessage);
            setIsStrong(strong);
        }
    }

    function handleRepeatPassword(event: ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        const repeatPassword = event.target.value;
        setRepeatPassword(repeatPassword);
        password === repeatPassword ? setIsValidRepeatPassword(true) : setIsValidRepeatPassword(false);
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
                onChange={handlePassword}
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
            <StyledPasswordValidation isValid={isStrong}>{errors}</StyledPasswordValidation>
            {
                isRegister && <TextField
                    id="register-password"
                    label="Repeat Password"
                    variant="outlined"
                    value={repeatPassword}
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleRepeatPassword}
                />}
            <StyledPasswordValidation isValid={isValidRepeatPassword}>
                {isValidRepeatPassword ? "Correct repeating password" : "Password must match"}
            </StyledPasswordValidation>
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

type ValidationProps = {
    isValid: boolean
}

const StyledPasswordValidation = styled.span<ValidationProps>`
  height: 1rem;
  ${props => !props.isValid ? "color: red;" : "color: green;"}
`;
