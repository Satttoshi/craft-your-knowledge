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
    const [isHovered, setIsHovered] = useState<boolean>(false);

    function handleLogout() {
        logout();
    }

    function handleMouseEnter() {
        isLoggedIn() && setIsHovered(true);
    }

    function handleMouseLeave() {
        setIsHovered(false);
    }

    if (isHovered) {
        return <StyledUserInfo className="userInfo">
            <Button onMouseLeave={handleMouseLeave} onClick={handleLogout} variant="outlined">logout</Button>
        </StyledUserInfo>;
    }

    return <StyledUserInfo
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="userInfo"
    >
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
