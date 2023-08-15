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
        password === repeatPassword ? setIsValidRepeatPassword(true) : setIsValidRepeatPassword(false);
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
            <StyledInput>
                <TextField
                    id="login-username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    required
                    onChange={e => setUsername(e.target.value)}
                />
            </StyledInput>
            <StyledInput>
                <TextField
                    id="login-adornment-password"
                    label="Password"
                    variant="outlined"
                    value={password}
                    required
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
                {isRegister &&
                    <StyledPasswordValidation isValid={isStrong}>{errors}</StyledPasswordValidation>
                }
            </StyledInput>
            {isRegister &&
                <StyledInput>
                    <TextField
                        id="register-password"
                        label="Repeat Password"
                        variant="outlined"
                        value={repeatPassword}
                        required
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleRepeatPassword}
                    />
                    {isRegister &&
                        <StyledPasswordValidation isValid={isValidRepeatPassword}>
                            {isValidRepeatPassword ? "Correct repeating password" : "Password must match"}
                        </StyledPasswordValidation>
                    }
                </StyledInput>
            }
            <Button variant="contained" color="primary" type="submit">
                Submit
            </Button>
        </StyledForm>
        {isRegister ?
            <span>Already have an account? <StyledLink to="/login">Login</StyledLink></span>
            :
            <span>Don't have an account? <StyledLink to="/register">Register</StyledLink></span>
        }

    </>)
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledInput = styled.div`
  position: relative;
  margin-bottom: 2rem;

  display: flex;
  justify-content: center;

`;

type ValidationProps = {
    isValid: boolean
}

const StyledPasswordValidation = styled.span<ValidationProps>`
  position: absolute;
  bottom: -1.3rem;
  height: 1rem;
  white-space: nowrap;
  font-weight: 300;

  ${props => !props.isValid ? "color: red;" : "color: green;"}
`;

const StyledLink = styled(Link)`
  color: var(--color5);
`;
