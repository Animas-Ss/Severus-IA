import { useRef, useEffect } from 'react';
import { useCircle } from '../canvas/circle';


export const Sphere = () => {
    const canvasRef = useRef(null)
  
    useEffect(() => {
      const canvas = canvasRef.current
      useCircle(canvas)
    }, [canvasRef])
    
  return (
    <div>
        <canvas id='canvas' ref={canvasRef}></canvas>
    </div>
  )
}
