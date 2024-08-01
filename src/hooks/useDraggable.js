import { useState } from 'react'

export const useDraggable = () => {
    const [position, setPosition] = useState({ x: 0, y:0});
    const [ dragging, setDragging] = useState(false)
    const [rel, setRel] = useState(null)

    const onMouseDown = (e) => {
        console.log(e)
        if( e.button !== 0 ) return ;
        /* console.log(e.target.getBoundingClientRect())
        const rect = e.target.getBoundingClientRect(); */
        const rect = e.target.getBoundingClientRect();

        setDragging(true);
        setRel({
            x: e.pageX - rect.left,
            y: e.pageY - rect.top
        });

        e.stopPropagation();
        e.preventDefault();
    }

    const onMouseUp = (e) => {
        setDragging(false);
        e.stopPropagation()
        e.preventDefault();
    }

    const onMouseMove = (e) => {
        if(!dragging) return;

        setPosition({
            x: e.pageX - rel.x,
            y: e.pageY - rel.y
        })

        e.stopPropagation()
        e.preventDefault()
    }

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    position
  }
}

