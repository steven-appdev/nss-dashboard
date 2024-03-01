import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";

interface Provider{
  provider: string;
}

function App() {

  const api = axios.create({
    baseURL: "https://w20003691.nuwebspace.co.uk/api/",
  });

  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
      const fetchProvider = async () => {
        let response = await api.get<Provider[]>("test");
        setProviders(response.data);
        console.log(response.data);
      };
      fetchProvider();
      
  }, []);

  return (
    <div className="App">
      {providers.map((data) =>(
          <p>{data.provider}</p>
        ))}
    </div>
  );
}

export default App;
