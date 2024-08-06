import "./App.css";
import { invoke } from "@tauri-apps/api/tauri";
import { useState, useEffect } from "react";
import { geminis } from "./intelligence/modelo/geminis";
import { Sphere } from "./components/Sphere";

import useSpeech from "./hooks/useSpeech";
import { geminis2 } from "./intelligence/modelo/geminis2";
import { Load } from "./components/Load/Load";
import { useWindows } from "./hooks/useWindows";
import { message as mes } from "@tauri-apps/api/dialog";

import { TbPencilBolt } from "react-icons/tb";
import { LuKeyRound } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { Nucleo } from "./components/Nucleo/Nucleo";

function App() {
  //OPTIMIZE: CAMBIAR ESTADOS POR UNO GLOBAL
  const [resCommand, setResCommand] = useState(""); //respuesta del backend a los comandos
  const [resIa, setResIa] = useState(""); //respuesta de la IA para pintar o decir

  //TODO: mensajes con la IA y guarado de comandos para poder manejarlos posteriormente
  const [comandos, setComandos] = useState([]); // comando que se envia al backend para realizarse
  const [messages, setMessages] = useState([]);

  // array de peticiones y respuestas para enviar a mi modelo
  const [textInput, setTextInput] = useState("");

  //TODO: apertura y cierre de ventanas configuraciones y modales
  const [closeKey, setCloseKey] = useState(false); // estado para  abrir o cerrar ventanas Key
  const [closeModal, setCloseModal] = useState(false); // estado para  abrir o cerrar ventanas Modal
  const [load, setLoad] = useState(false);

  const { isListening, transcript, startListening, stoptListening, asistent } =
    useSpeech({ continuous: true });

  const { createWindow, closeWindow, loadWindows } = useWindows();

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
  }, [isListening, startListening, stoptListening, asistent]);

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

  const iA = async () => {
    try {
      const resoult = await geminis(messages);

      const { response, commands } = resoult.data;

      const stringRes = JSON.stringify(resoult);

      await setMessages((old) => [
        ...old,
        { role: "assistant", content: stringRes },
      ]);

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
    try {
      const response = await geminis2(messages);
      setMessages((old) => [
        ...old,
        { role: "assistant", content: response.text },
      ]);
      await mes(response.text, { title: "Severus", type: "info" });
      setLoad(false);
    } catch (error) {
      alert(error);
      setLoad(false);
    }
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

      {/* <Nucleo/> */}

      <button
        disabled={loadWindows}
        className={asistent ? "btn-read-asistent" : "btn-read"}
        onClick={() => {
          if (closeModal) {
            closeWindow(asistent ? winAsistent.lebel : winQuest.lebel);
            setCloseModal(false);
          } else {
            createWindow(asistent ? winAsistent : winQuest);
            setCloseModal(true);
          }
        }}
      >
        {closeModal ? <IoClose /> : <TbPencilBolt />}
      </button>

      <button
        disabled={loadWindows}
        className={asistent ? "btn-key-asistent" : "btn-key"}
        onClick={() => {
          if (closeKey) {
            closeWindow(winKey.lebel);
            setCloseKey(false);
          } else {
            createWindow(winKey);
            setCloseKey(true);
          }
        }}
      >
        {closeKey ? <IoClose /> : <LuKeyRound />}
      </button>
    </div>
  );
}

export default App;
