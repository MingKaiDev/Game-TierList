import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendURL}/api/hello`, {
      method: "GET",
      mode: "cors"
    })
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);


  return <h1>{message}</h1>;
}

export default App;
