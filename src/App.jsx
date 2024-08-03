import "./App.css";
import { invoke } from "@tauri-apps/api/tauri";
import { useState, useEffect } from "react";
import { geminis } from "./intelligence/modelo/geminis";
import { Sphere } from "./components/Sphere";

import useSpeech from "./hooks/useSpeech";
/* import { Modal } from "./components/Modal/Modal"; */
/* import { useDraggable } from "./hooks/useDraggable"; */
import { geminis2 } from "./intelligence/modelo/geminis2";
import { Load } from "./components/Load/Load";
import { useWindows } from "./hooks/useWindows";
import { dataDir } from "@tauri-apps/api/path";
import { message as mes } from "@tauri-apps/api/dialog";

import { TbPencilBolt } from "react-icons/tb";

/* import { appWindow } from "@tauri-apps/api/window";

await appWindow.setIgnoreCursorEvents(true) */

function App() {
  const [resCommand, setResCommand] = useState(""); //respuesta del backend a los comandos
  const [order, setOrder] = useState(""); // orden del usuario por ahora en el input
  const [resIa, setResIa] = useState(""); //respuesta de la IA para pintar o decir
  const [comandos, setComandos] = useState([]); // comando que se envia al backend para realizarse
  const [messages, setMessages] = useState([]);
  // array de peticiones y respuestas para enviar a mi modelo
  const [textInput, setTextInput] = useState("");
  const [user, setUser] = useState({});
  const [close, setClose] = useState(false); // estado para  abrir o cerrar ventanas
  const [cierre, setCierre] = useState(false) // cierre de las otras ventanas

  const [load, setLoad] = useState(false);

  const { isListening, transcript, startListening, stoptListening, asistent } =
    useSpeech({ continuous: true });

  const { createWindow, closeWindow } = useWindows();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Combinación de teclas Alt + X
      if (event.altKey && event.key === "x") {
        if (isListening) {
          stoptListening();
        } else {
          startListening();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isListening, startListening, stoptListening]);

  const startStopListening = () => {
    isListening ? stopVoiceInput() : startListening();
  };

  const stopVoiceInput = async () => {
    setMessages((old) => [...old, { role: "user", content: transcript }]);
    setTextInput(
      (prevVal) =>
        prevVal +
        (transcript.length ? (prevVal.length ? " " : "") + transcript : "")
    );
    stoptListening();
    /* console.log(textInput) */
  };

  async function command() {
    setResCommand(await invoke("execute_command", { comandos }));
  }

  const iA = async () => {
    try {
      const resoult = await geminis(messages);

      console.log(resoult);
      const { response, commands } = resoult.data;

      const stringRes = JSON.stringify(resoult);

      await setMessages((old) => [
        ...old,
        { role: "assistant", content: stringRes },
      ]);

      await setResIa(response);

      await setComandos(commands);
      alert(response);
      setResCommand(await invoke("execute_command", { comandos: commands }));
      setLoad(false);
    } catch (error) {
      alert(error);
      setLoad(false);
    }
  };

  const iA2 = async () => {
    const response = await geminis2(messages);
    console.log(response);
    /* setOrder(response.text) */
    /* alert(response.text) */
    setMessages((old) => [
      ...old,
      { role: "assistant", content: response.text },
    ]);
    console.log(messages);
    setLoad(false);
    await mes(response.text, { title: order, type: "info" });
  };

  const handleChange = (e) => {
    setTextInput(e.target.value);
    /* setOrder((old) => e.target.value); */
    setUser({ role: "user", content: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isListening) {
      if (!asistent) {
        setLoad(true);
        await iA2();
      } else {
        setLoad(true);
        await iA();
      }
      setTextInput("");
    }
  };

  const handleDelete = (prompt) => {
    const newMessage = message.filter((item) => item.prompt !== prompt);
    setMessage(newMessage);
  };

  const winQuest = {
    lebel: "modal-ia-quest",
    url: "./modal.html",
    decorations: false,
    center: true,
    resizable: true,
    transparent: true,
    width: 400,
    height: 600,
  };

  const winAsistent = {
    lebel: "modal-ia-asistent",
    url: "./write.html",
    decorations: false,
    center: true,
    resizable: true,
    transparent: true,
    width: 350,
    height: 80,
  };

  const winKey = {
    lebel: "modal-ia-key",
    url: "./keys.html",
    decorations: false,
    center: true,
    resizable: true,
    transparent: true,
    width: 350,
    height: 80,
  };

  return (
    <div className="container" data-tauri-drag-region>
      <div className="sound-container">
        <Sphere />
        <div className="btn-container">
          <form
            className={asistent ? `btn-hablar-asistent` : "btn-hablar"}
            onSubmit={handleSubmit}
          >
            {load ? (
              <Load />
            ) : (
              <button
                className={asistent ? `btn-nucleo-asistent` : "btn-nucleo"}
                onClick={() => {
                  startStopListening();
                }}
                style={{ transform: isListening ? "scale(1.8)" : "scale(1)" }}
              ></button>
            )}
            <div className="btn-menu-right"></div>
            <div className="btn-menu-left"></div>
          </form>
        </div>
      </div>

      {/* <form className={asistent ? "row" : "row"} onSubmit={handleSubmit}>
          <input
            id="prueba"
            onChange={handleChange}
            placeholder="Enter a name..."
            value={
              isListening
                ? textInput +
                  (transcript.length
                    ? (textInput.length ? " " : "") + transcript
                    : "")
                : textInput
            }
          />
          <button type="submit" onClick={() => setMessages((old) => ([...old, user]))}>prueba</button>
        </form> */}

      {/* {
        windows.map(win => <button key={win.id} onClick={async () => await setWindowData(win.id, win.data )}>{win.id}</button>)
       } */}

      <button
        className="btn-read"
        onClick={() => {
          if(cierre){
            closeWindow(asistent ? winAsistent.lebel : winQuest.lebel)
            setCierre(false)
          }else{
            createWindow(asistent ? winAsistent : winQuest);
            setCierre(true)
          }
        }}
      >
        <TbPencilBolt />
      </button>

      {
        <button
          className="btn-key"
          onClick={() => {
            if(close){
               closeWindow(winKey.lebel);
               setClose(false)
            }else {
              createWindow(winKey);
              setClose(true)
            }
          }}
        >
          {close ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              color="#000000"
              fill="none"
            >
              <path
                d="M10.2471 6.7402C11.0734 7.56657 11.4866 7.97975 12.0001 7.97975C12.5136 7.97975 12.9268 7.56658 13.7531 6.74022L13.7532 6.7402L15.5067 4.98669L15.5067 4.98668C15.9143 4.5791 16.1182 4.37524 16.3302 4.25283C17.3966 3.63716 18.2748 4.24821 19.0133 4.98669C19.7518 5.72518 20.3628 6.60345 19.7472 7.66981C19.6248 7.88183 19.421 8.08563 19.0134 8.49321L17.26 10.2466C16.4336 11.073 16.0202 11.4864 16.0202 11.9999C16.0202 12.5134 16.4334 12.9266 17.2598 13.7529L19.0133 15.5065C19.4209 15.9141 19.6248 16.1179 19.7472 16.3299C20.3628 17.3963 19.7518 18.2746 19.0133 19.013C18.2749 19.7516 17.3965 20.3626 16.3302 19.7469C16.1182 19.6246 15.9143 19.4208 15.5067 19.013L13.7534 17.2598L13.7533 17.2597C12.9272 16.4336 12.5136 16.02 12.0001 16.02C11.4867 16.02 11.073 16.4336 10.2469 17.2598L10.2469 17.2598L8.49353 19.013C8.0859 19.4208 7.88208 19.6246 7.67005 19.7469C6.60377 20.3626 5.72534 19.7516 4.98693 19.013C4.2484 18.2746 3.63744 17.3963 4.25307 16.3299C4.37549 16.1179 4.5793 15.9141 4.98693 15.5065L6.74044 13.7529C7.56681 12.9266 7.98 12.5134 7.98 11.9999C7.98 11.4864 7.5666 11.073 6.74022 10.2466L4.98685 8.49321C4.57928 8.08563 4.37548 7.88183 4.25307 7.66981C3.63741 6.60345 4.24845 5.72518 4.98693 4.98669C5.72542 4.24821 6.60369 3.63716 7.67005 4.25283C7.88207 4.37524 8.08593 4.5791 8.49352 4.98668L8.49353 4.98669L10.2471 6.7402Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              color="#000000"
              fill="none"
            >
              <path
                d="M15.5 14.5C18.8137 14.5 21.5 11.8137 21.5 8.5C21.5 5.18629 18.8137 2.5 15.5 2.5C12.1863 2.5 9.5 5.18629 9.5 8.5C9.5 9.38041 9.68962 10.2165 10.0303 10.9697L2.5 18.5V21.5H5.5V19.5H7.5V17.5H9.5L13.0303 13.9697C13.7835 14.3104 14.6196 14.5 15.5 14.5Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.5 6.5L16.5 7.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          )}
        </button>
      }

      <p>
        {resIa} - {resCommand}
      </p>

      {/* {
           message.map(item => (<Modal key={item.prompt} res={item} asistent={asistent} handleDelete={handleDelete}/>))
         } */}
    </div>
  );
}

export default App;
