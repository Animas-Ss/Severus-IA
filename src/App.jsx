import "./App.css";
import { invoke } from "@tauri-apps/api/tauri";
import { useState, useEffect} from "react";
import { geminis } from "./intelligence/modelo/geminis";
import { Sphere } from "./components/Sphere";

import useSpeech from "./hooks/useSpeech";
/* import { Modal } from "./components/Modal/Modal"; */
/* import { useDraggable } from "./hooks/useDraggable"; */
import { geminis2 } from "./intelligence/modelo/geminis2";
import { Load } from "./components/Load/Load";
import { useWindows } from "./hooks/useWindows";
import { dataDir } from "@tauri-apps/api/path";
import { message as mes } from "@tauri-apps/api/dialog"



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
  const [user, setUser] = useState({})

 
  const [load, setLoad] = useState(false)

  const { isListening, transcript, startListening, stoptListening , asistent} = useSpeech(
    { continuous: true }
  );

  const {createWindow} = useWindows()

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Combinación de teclas Alt + X
      if (event.altKey && event.key === 'x') {
        if (isListening) {
          stoptListening();
        } else {
          startListening();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isListening, startListening, stoptListening]);
  
  const startStopListening = () => {
    isListening ? stopVoiceInput() : startListening();
  };

  const stopVoiceInput = async () => {
    setMessages((old) => ([...old, {role: "user", content: transcript}]))
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
  };

  const iA = async () => {
    try {
      const resoult = await geminis(messages);
      
      console.log(resoult)
      const { response, commands } = resoult.data;

    const stringRes = JSON.stringify(resoult);

    await setMessages((old) => [...old,{ role: "assistant", content: stringRes}]);

    await setResIa(response);

    await setComandos(commands);
    alert(response)
    setResCommand(await invoke("execute_command", { comandos: commands }));
    setLoad(false)
    } catch (error) {
      alert(error)
      setLoad(false)
    }
  };
  
  const iA2 = async () => {
    const response = await geminis2(messages);
    console.log(response)
    /* setOrder(response.text) */
    /* alert(response.text) */
    setMessages((old) => [...old, { role: "assistant", content: response.text }]);
    console.log(messages)
    setLoad(false)
    await mes(response.text, {title: order, type: "info"})
  };
  
  const handleChange = (e) => {
    setTextInput(e.target.value);
    /* setOrder((old) => e.target.value); */
    setUser({role: "user", content: e.target.value})
  };
  
  const handleSubmit = async (e) =>{
    e.preventDefault(); 
    if(!isListening){
      if(!asistent){
        setLoad(true)
        await iA2();
      }else{
        setLoad(true)
        await iA();
      }
      setTextInput("");
    }
  };

  const handleDelete = (prompt) => {
     const newMessage = message.filter(item => item.prompt !== prompt)
     setMessage(newMessage)
  };


  const winQuest = {
          lebel:"modal-ia-quest",
          url:"./modal.html",
          decorations: false,
          center: true,
          resizable:  true,
          transparent: true,
          width: 400,
          height: 600,
  }

  const winAsistent = {
    lebel:"modal-ia-asistent",
    url:"./write.html",
    decorations: false,
    center: true,
    resizable:  true,
    transparent: true,
    width: 400,
    height: 100,
  }

  return (
      <div className="container" data-tauri-drag-region>

        <div className="sound-container">
          <Sphere/>
          <div className="btn-container">
            <form className={asistent ? `btn-hablar-asistent` : "btn-hablar"} onSubmit={handleSubmit} >
              {
                load ? <Load/> : <button
                className={asistent ? `btn-nucleo-asistent` : "btn-nucleo"}
                onClick={() => {
                  startStopListening();
                }}
                style={{transform: isListening ? 'scale(1.8)': 'scale(1)'}}
              ></button>
              }
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

        <button className="btn-read" 
        onClick={() => { createWindow(asistent ? winAsistent : winQuest)}}>create</button>
      

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
