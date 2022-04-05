import React, { useState, useEffect } from 'react';
import Input from '../components/NuggetTab/Input/Input';

import './testing1.css';


const Testing1 = ({ cortes, parentCallback, duration }) => {


  const [newCortes, setNewCortes] = useState(cortes)
  const [totalDuration, setTotalDuration] = useState(duration)

  // const dispatch = useDispatch() 

  useEffect( ()=>{
    console.log(cortes)
  })

  useEffect(()=>{
      setTotalDuration(duration)
  }, [])




  function formatDecimals(num){
    console.log(num)
      num = num.toFixed(2)
      return num;
  }

  function pasarAPor(num){
    return (num * 100) / totalDuration
  }
  
  const inputDefValue = (value, point, index) => {
    function manualChange(event, point, index) {
      // console.log(event.target.value, point, index);
      var childData = {
        "value" : event.target.value,
        "point" : point,
        "index" : index
      }
      parentCallback(childData);
      console.log( event.target);
      setTimeout(() => {
        event.target.focus()
        
      }, 300);
    }
    

    return(
      <div key={value} className="input-cont">
        <input type="number" onChange={(e) => manualChange(e, point, index)}  className="segundos-de-corte" defaultValue={value} />

        {/* <Input type="number" value={cortes[index][point]} onChange={(value)=>setNewCortes({...cortes[index][point], start: value})} /> */}
      </div>
    )
  }


 

  function render(){
      return  <div id="Testing1-view">
                <article>
                    <h2>Cortes nugget 1 (en segundos)</h2>
                    <ul>
                    {cortes.map((corte, index)=>(
                        <>
                            <li className="cortes">
                              <input type="name" className="corte-titulo" defaultValue={`Corte ${index+1}`} />
                              {/* <div className='corte-progress' style={{ 'background-image': `linear-gradient(to right, var(--gris2) 0%, var(--gris2) ${pasarAPor(corte.start)}%, var(--violeta) ${pasarAPor(corte.start)} %, var(--violeta) ${pasarAPor(corte.start)},  var(--gris2) 71.989%,  var(--gris2) 100%);` }}> */}
                              <div className='corte-progress' style={{'background':`linear-gradient(90deg, var(--gris2) ${pasarAPor(corte.start)}%, var(--violeta) ${pasarAPor(corte.start)}%, var(--violeta) ${pasarAPor(corte.end)}%, var(--gris2) ${pasarAPor(corte.end)}%)`}}>
                              </div>
                              {/* <span contentEditable="true">{ formatDecimals(corte.start) } </span><i>segs</i> */}
                              { inputDefValue(formatDecimals(corte.start), 'start', index) } <i>segs</i>
                              <span> - </span>
                              { inputDefValue(formatDecimals(corte.end), 'end', index) } <i>segs</i>
                              <br />
                              <textarea placeholder='Notas'/>
                            </li>
                        </> 
                      ))
                    }
                  </ul>

                </article>
              </div>

       }
       
       
       return ( render() )
}




export default Testing1;