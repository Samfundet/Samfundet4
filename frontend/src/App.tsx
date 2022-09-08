import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import RouterRoutes from "./RouterRoutes";

function App() {
    const a = axios.get("http://localhost:8000/arrangementer/api2/test");
    console.log(a);

    return (
        <BrowserRouter>
            <RouterRoutes />
        </BrowserRouter>
    );
}

export default App;
