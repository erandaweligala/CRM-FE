import './App.scss';
import MainRoutes from "./routing/main-router";
import ApiLoadingSpinner from "./components/api-loading-spinner/ApiLoadingSpinner";
import {initialApplicationLoading} from "./services/authentication-logic.service";
import {BSS_ThemeWrapper as BssThemeWrapper} from "bss-component-library";

function App() {

    initialApplicationLoading(true);

    return (
        <div style={{minWidth: 1024}}>
                <ApiLoadingSpinner/>
                <BssThemeWrapper>
                    <MainRoutes/>
                </BssThemeWrapper>
        </div>
    )

}

export default App
