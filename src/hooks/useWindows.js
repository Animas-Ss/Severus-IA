import {useState, useEffect} from 'react'
import { WebviewWindow } from "@tauri-apps/api/window";

export const useWindows = () => {
  const [loadWindows, setLoadWindows] = useState(false);
  const [open, setOpen] = useState([])
  const [ultimate, setUltimate] = useState("")
  

  const createWindow = (options) => {
    setUltimate(options.lebel)
    setOpen(old => [...old, options.lebel])
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
    })
  };

  const close = () => {
    open.map(lebel => {
      if(lebel !== ultimate){
        new WebviewWindow(lebel).close();
      }
    })
  }

  const closeWindow = async (id) => {
    new WebviewWindow(id).close();
  }

  return {
    createWindow,
    closeWindow,
    loadWindows
  };
};
