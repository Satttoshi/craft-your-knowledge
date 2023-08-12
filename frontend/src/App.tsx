import GlobalStyles from "./GlobalStyles.tsx";
import theme from "./utils/mui-theme.ts";
import {ThemeProvider} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Create from "./pages/Create.tsx";
import NotFound from "./pages/NotFound.tsx";
import WorkshopDetail from "./pages/WorkshopDetail.tsx";
import {useEffect} from "react";
import {useStore} from "./hooks/useStore.ts";

function App() {
    const me = useStore(state => state.me)

    useEffect(me, [me])

    return (
        <>
            <GlobalStyles/>
            <ThemeProvider theme={theme}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/create" element={<Create/>}/>
                    <Route path="/workshop/:id" element={<WorkshopDetail/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </ThemeProvider>
        </>
    )
}

export default App
