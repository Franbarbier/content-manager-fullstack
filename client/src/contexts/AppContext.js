import React, {useState, useMemo, useEffect, useRef} from 'react';

import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';

import { getProjects } from '../actions/projects';


const AppContext = React.createContext();

export function AppProvider(props){
    
    const dispatch = useDispatch()
    const { pathname } = useLocation()
    
    const [loadingProjects, setLoadingProjects] = useState(true) 
    
    const setters = [setLoadingProjects]

    
    useEffect(()=>{
        setAllLoading()
            setAllLoading(true)
            dispatch( getProjects() ).then(()=>setLoadingProjects(false))
    }, [pathname])

    function setAllLoading(){
        for(let setter of setters){
            setter(true)
        }
    }

    const value = useMemo(()=>{
        return ({
            loading: {projects: loadingProjects}
        })
    }, [loadingProjects])
    
    console.log(value)

    return <AppContext.Provider value={value} {...props} />

}

export function useAppContext(){
    const context = React.useContext(AppContext)
    if(!context){
        throw new Error("useAppContext must be inside AppContext provider")
    }
    return context;
}