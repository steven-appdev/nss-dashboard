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
    <div className="App flex flex-col h-screen">
      <Options onChange={setOption}/>
      <Positive question={option["qdrop"]} population={option["popdrop"]} mode={option["modedrop"]} level={option["leveldrop"]} />
    </div>
  );
}
