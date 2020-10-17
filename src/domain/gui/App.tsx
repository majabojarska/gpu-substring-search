import React from "react";
import "./styles/App.scss";
import ModePicker from './components/ModePicker/ModePicker'
import Chart from './components/Chart/Chart'

const App: React.FC = () => {

  return (
    <div className='container'>
      <ModePicker />
      <Chart />
    </div>
  );
};

export default App;
