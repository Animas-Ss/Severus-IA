import "./Nucleo.css";
import {useRef, useState, useEffect} from 'react';


export const Nucleo = () => {
    const listRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
  
  
    useEffect(() => {
      const listNode = listRef.current;
      const btnNode = listNode.querySelectorAll("button");
      console.log(btnNode)
    }, [currentIndex]);
  
  
    return (
      <div className="nucleo-container">
        <div className="slider-nucleo">
          <div className='leftArrow'>A</div>
          <div className='rightArrow'>A</div>
          <div className="container-btn" ref={listRef}>
            <button>A</button>
            <button>C</button>
            <button>W</button>
          </div>
        </div>
      </div >
    )
  }
