import "./Nucleo.css";
import {useRef, useState, useEffect} from 'react';

import { TbPencilBolt } from "react-icons/tb";
import { LuKeyRound, LuSettings, LuMic } from "react-icons/lu";


export const Nucleo = () => {
    const listRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [configControl, setConfigControl] = useState(false)
  
   const next = () => {
     setCurrentIndex(prev => (prev + 1) % 4)
   };

   const prev = () => {
    setCurrentIndex(prev => (prev - 1 + 4) %4)
   }



    useEffect(() => {
      console.log(currentIndex)
      const listNode = listRef.current;
      const btnNode = listNode.querySelectorAll("button")

      if(btnNode){
        btnNode.forEach((btn, index) => {
          btn.style.zIndex = index === currentIndex ? "20" : "1";
          btn.style.opacity = index === currentIndex ? '1' : '0';
        });
      }
      
    }, [currentIndex]);
    
    console.log(configControl)
  
    return (
      <div className="nucleo-container" data-tauri-drag-region>
        <div className="slider-nucleo" data-tauri-drag-region onClick={(event) => {
          event.stopPropagation()
          setConfigControl(!configControl)
        }} 
          style={{ transform: configControl ? "scale(1.8)" : "scale(1)" }}>
          <div className="container-btn" ref={listRef} style={{ transform: configControl ? "translate(-50%, -50%) scale(0.6)" : "translate(-50%, -50%) scale(1)", visibility: configControl? "visible" : "none", opacity: configControl? "1" : "0" }}>
          <div className='leftArrow' onClick={(event) => {
            event.stopPropagation()
            prev()
            }}>{"<"}</div>
          <div className='rightArrow' onClick={(event) => {
            event.stopPropagation()
            next()
            }}>{">"}</div>
            <button className="btn-funtion-nucleo" onClick={() => console.log("voz")}><LuMic /></button>
            <button className="btn-funtion-nucleo" onClick={() => console.log("configuracion")}><LuKeyRound/></button>
            <button className="btn-funtion-nucleo" onClick={() => console.log("escribir")}><TbPencilBolt/></button>
            <button className="btn-funtion-nucleo" onClick={() => console.log("configuraciones")}><LuSettings /></button>
          </div>
        </div>
      </div >
    )
  }
