import {ReactComponent as Cog} from "../assets/cog.svg";
import styled from "@emotion/styled";

export default function GearsLoading() {
    return <StyledCog/>
}

const StyledCog = styled(Cog)`
    width: 100px;
    height: 100px;
    fill: white;
`;
