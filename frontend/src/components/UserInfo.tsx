import {ReactComponent as User} from "../assets/user.svg";
import styled from "@emotion/styled";
import {useStore} from "../hooks/useStore.ts";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import {useState} from "react";

export default function UserInfo() {
    const user = useStore((state) => state.username);
    const isLoggedIn = useStore((state) => state.isLoggedIn);
    const logout = useStore((state) => state.logout);
    const [isLogout, setIsLogout] = useState<boolean>(false);

    function handleClick() {
        isLoggedIn() && setIsLogout(true);
    }

    function handleLogout() {
        setIsLogout(false);
        logout();
    }

    if (isLogout) {
        return <StyledUserInfo className="userInfo">
            <Button onClick={handleLogout} variant="outlined">logout</Button>
        </StyledUserInfo>;
    }

    return <StyledUserInfo onClick={handleClick} className="userInfo">
        {
            !isLoggedIn()
                ?
                <Link to={"/login"}><Button variant="contained">login</Button></Link>
                :
                <>
                    <User/>
                    <p>{user}</p>
                </>
        }

    </StyledUserInfo>;
}

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
