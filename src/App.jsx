import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignUp from "./views/Authentication/SignUp";
import SignIn from "./views/Authentication/SignIn";

function App() {
    return (
        <Routes>
            <Route path="/auth">
                <Route path="sign-up" element={<SignUp />} />
                <Route path="sign-in" element={<SignIn />} />
            </Route>
        </Routes>
    );
}

export default App;
