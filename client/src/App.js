import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ScrollToTop from './ScrollToTop';


import { AppProvider } from './contexts/AppContext';

 import './css-gral.css';

import Editor from './Video_Editor/VideoEditor'
import NewProject from "./views/NewProyect/NewProject";
import Dash from './views/dash/dash';
import EditProject from './views/EditProject/EditProject';


const App = () => {


  const [activeTab, setActiveTab] = useState('dash')


  function render(){
    return (
        <Router>
          <AppProvider>
          <ScrollToTop/>
            <Switch>
                <Route exact path="/">
                    <Dash setActiveTab={setActiveTab} />
                </Route>
                <Route exact path="/new-project">
                    <NewProject setActiveTab={setActiveTab} />
                </Route>
                <Route path="/project/:id">
                    <EditProject setActiveTab={setActiveTab} />
                </Route>
            {/* <Route path="/cliente/:id">
                    <MainLayout>
                        <ApartadoCliente setActiveTab={setActiveTab} user={user} />
                    </MainLayout>
                </Route> */}
            </Switch>
            </AppProvider>
        </Router>
    );
  }

  return (
    render()        
  )

}

export default App;