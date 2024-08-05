import {useState} from 'react'
import { WebviewWindow } from "@tauri-apps/api/window";

//FIX: mejorar esta parte logica de las ventanas mal plantiada
export const useWindows = () => {
  const [loadWindows, setLoadWindows] = useState(false);
  const [open, setOpen] = useState([])
  const [ultimate, setUltimate] = useState("")

  const createWindow = (options) => {
     setOpen((prevWindows) => {
      if(prevWindows.includes(options.lebel)){
        return prevWindows;
      }
      return [...prevWindows, options.lebel]
     })
    
     setUltimate(options.lebel)
     setLoadWindows(true)

    const webview = new WebviewWindow(options.lebel, {
      url: options.url,
      decorations: options.decorations || false,
      center: options.center || false,
      resizable: options.resizable || false,
      transparent: options.transparent || false,
      width: options.width || 300,
      height: options.height || 300,
    });

    webview.once("tauri://created", () => {
      console.log('Success create window');
      setLoadWindows(false)
      return;
    })

    webview.once("tauri://error", (e) => {
      console.error('Failed to create window', e);
      //FIX: para evitar el error de ventanas se gestiona un parche para la solucion
      const webview = new WebviewWindow(e.windowLabel)
      webview.close();
      setLoadWindows(false)
    })
  };

  const closeWindow = async (id) => { 
    //FIX: falta comprobaciones si la ventana no esta fue cerrada pero igual se llama a esta funcion
    WebviewWindow.getByLabel(id).close();
  }
  
  //TODO: funcion de prueba para el cierre de todas las ventanas enos la ultima 
/*   const close = () => {
    setOpen((pre) => {
      return pre.filter((window) => {
        if(window !== ultimate){
          closeWindow(window)
          return false
        }
        return true;
      })
    })
  } */


  return {
    createWindow,
    closeWindow,
    loadWindows
  };
};
