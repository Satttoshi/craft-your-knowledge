import {ReactComponent as User} from "../assets/user.svg";
import styled from "@emotion/styled";
import {useStore} from "../hooks/useStore.ts";

export default function UserInfo() {
    const user = useStore((state) => state.user);

    return <StyledUserInfo><User/>
        <p>{user}</p></StyledUserInfo>;
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
