import React, {useState} from 'react';
import './App.css';
import './tail.css';
import Options from './components/options';
import Positive from './components/positive';

export default function App() {

  const [option, setOption] = useState<{[key: string]: string}>({
    qdrop: "all",
    popdrop: "registered",
    modedrop: "all",
    leveldrop: "all"
  });

  return (
    <div className="App">
      <Options onChange={setOption}/>
      <Positive currentLevel={option["leveldrop"]} />
    </div>
  );
}
