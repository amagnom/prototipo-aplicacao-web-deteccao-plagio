import Links from "./Links";
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

function App() {
    return (
        <div>
            <Links></Links>
        </div>
    );
}

export default App;
