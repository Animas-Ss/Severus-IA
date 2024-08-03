
import { WebviewWindow, appWindow } from "@tauri-apps/api/window";

export const useWindows = () => {
  const createWindow = (options) => {
    const webview = new WebviewWindow(options.lebel, {
      url: options.url,
      decorations: options.decorations || false,
      center: options.center || false,
      resizable: options.resizable || false,
      transparent: options.transparent || false,
      width: options.width || 300,
      height: options.height || 300,
    });

    webview.once("", () => {

    })

    webview.once("", () => {
      
    })
  };

  const closeWindow = async (id) => {
    new WebviewWindow(id).close()
  }

  return {
    createWindow,
    closeWindow
  };
};
