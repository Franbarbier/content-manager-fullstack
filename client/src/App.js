import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ScrollToTop from './ScrollToTop';


import { AppProvider } from './contexts/AppContext';

 import './css-gral.css';

import Editor from './Video_Editor/VideoEditor'
// import NewProject from "./views/NewProyect/NewProject";
import NewProject2 from "./views/NewProyect/NewProject2";
import Dash from './views/dash/dash';
import EditProject from './views/EditProject/EditProject';
import Login from './views/Login/Login';

import { verifyUser } from './api';

const App = () => {


  const [activeTab, setActiveTab] = useState('dash')
  const [user, setUser] = useState({})

  useEffect(()=>{
    // verifyUser().then((res)=>setUser(res))
  }, [])

  useEffect(()=>{
    console.log(user)
  })


  function render(){
    return (
      <>

      {/* { !user.mail ?
        <Login setUser={setUser} />
      : */}
        <Router>
          <AppProvider>
          <ScrollToTop/>
            <Routes>
                
                <Route exact path="/" element={<Dash setActiveTab={setActiveTab} />}/>
                <Route exact path="/new-project" element={<NewProject2 setActiveTab={setActiveTab} />}/>
                <Route exact path="/project/:id" element={<EditProject setActiveTab={setActiveTab} />}/>

            </Routes>
            </AppProvider>
        </Router>
        {/*  } */}
      </>
    );
  }

  return (
    render()        
  )

}

export default App;