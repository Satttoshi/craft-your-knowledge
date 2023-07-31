import CreateForm from "./components/CreateForm.tsx";
import WorkshopList from "./components/WorkshopList.tsx";
import GlobalStyles from "./GlobalStyles.tsx";
import theme from "./utils/mui-theme.ts";
import {ThemeProvider} from "@mui/material";

function App() {

    return (
        <>
            <ThemeProvider theme={theme}>
                <GlobalStyles/>
                <WorkshopList/>
                <CreateForm/>
            </ThemeProvider>
        </>
    )
}

export default App
