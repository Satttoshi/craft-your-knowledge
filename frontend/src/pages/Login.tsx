import {TextField, IconButton, InputAdornment, Button} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from "@emotion/styled";
import {ChangeEvent, FormEvent, useState} from "react";
import {useStore} from "../hooks/useStore.ts";
import {Link, useNavigate, useLocation} from "react-router-dom";
import PasswordValidator from "../utils/PasswordValidator.ts";
import {ReactComponent as Back} from "../assets/back.svg";

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<string>("");
    const [errorsRepeatPassword, setErrorsRepeatPassword] = useState<string>("");
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
        if (password === repeatPassword) {
            setIsValidRepeatPassword(true);
            setErrorsRepeatPassword("Looks good!")
        } else {
            setIsValidRepeatPassword(false);
            setErrorsRepeatPassword("Password must match")
        }
    }

    function handleBack() {
        navigate("/");
    }

    return (<>
        <StyledHeader>
            <StyledBackButton onClick={handleBack} variant="outlined">
                <Back/>
            </StyledBackButton>
            <h1>Craft Your Knowledge</h1>
        </StyledHeader>
        <StyledForm onSubmit={e => handleSubmit(e, isRegister)}>
            {isRegister ? <h2>Register</h2> : <h2>Login</h2>}
            <StyledInput>
                <StyledTextField
                    id="login-username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    required
                    onChange={e => setUsername(e.target.value)}
                />
            </StyledInput>
            <StyledInput>
                <StyledTextField
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
                    <StyledTextField
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
                            {errorsRepeatPassword}
                        </StyledPasswordValidation>
                    }
                </StyledInput>
            }
            <StyledSubmitButton variant="contained" color="primary" type="submit">
                Submit
            </StyledSubmitButton>
        </StyledForm>
        {isRegister ?
            <span>Already have an account? <StyledLink to="/login">Login</StyledLink></span>
            :
            <span>Don't have an account? <StyledLink to="/register">Register</StyledLink></span>
        }

    </>)
}

const StyledHeader = styled.header`
  display: flex;
  width: 80vw;
  align-items: center;
  justify-content: space-between;
  position: relative;

  button {
    position: absolute;
    left: 0;
  }

  h1 {
    margin: 0;
    font-family: var(--fontCode);
    font-weight: 300;
    text-align: center;

    font-size: clamp(1.2rem, 4.5vw, 3rem);
    white-space: nowrap;
    flex: 1;
  }

  @media (max-width: 768px) {
    margin: 1rem 0;
    width: 90vw;
    h1 {
      text-align: right;
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
`;

const StyledInput = styled.div`
  position: relative;
  margin-bottom: 2rem;

  display: flex;
  justify-content: center;
`;

const StyledTextField = styled(TextField)`
  width: 50vw;
  min-width: 20rem;
  max-width: 30rem;
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

const StyledSubmitButton = styled(Button)`
  margin: 1rem 0;
`;
