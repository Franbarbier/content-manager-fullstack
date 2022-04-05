import React, { useState, useEffect } from 'react';

// import thumg_img from '../../../../server/public/'

import './AddTag.css';


const AddTag = ({setProjectData, projectData}) => {

    const [ tagValue, setTagValue] = useState()
    const [ tagList, setTagList] = useState([])


    useEffect( ()=>{
        setProjectData( { ...projectData, tags: tagList  } )
    }, [tagList] )

    function checkIfEnter(e) {
        if (e.keyCode == 13) {            
            if (tagValue.replace(/\s/g, "") !== "") {

                setTagList(tagList => [...tagList,tagValue] );
                document.getElementById('newTag').value = '';
            }
        }
    }
    function deleteTag(e){ setTagList( tagList.filter(item => item !==  e.target.closest('li').textContent.slice(0, -1) ) ); }



  function render(){
      return <>
                <div class="_box">
                    <label for="tagList">Add tag (Presiona ENTER para agregarla)</label>
                    <input type="text" onChange={ (e)=>{ setTagValue(e.target.value) } } onKeyDown={ (e) => { checkIfEnter(e) } } id="newTag" />
                    <ul id="tagList">
                        {/* <!-- All TagList Here! --> */}
                        {tagList.map((tag, index)=>(
                                <li>{tag}<span onClick={ (e)=>{ deleteTag(e) } } class="rmTag">&times;</span></li>
                        ))}
                    </ul>  
                </div>
             </>
             

       }
       
       
       return ( render() )
}




export default AddTag;
