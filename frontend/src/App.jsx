import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

function App() {
    useEffect(() => {
        fetch("api/health")
            .then((res) => res.json())
            .then((data) => console.log(data));
    }, []);

    return <h1>Dental App</h1>;
}

export default App;
