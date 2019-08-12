import React from 'react';
import '../App.css';
import Login from '../components/Login';

function Home() {
  return (
    <div className="App">
      <Login />
      <header className="App-header">
        <img src="/pixel8.jpg" alt="Future home of Pixel8.earth" width={400}/>
        Future home of Pixel8.earth
      </header>
    </div>
  );
}

export default Home;
