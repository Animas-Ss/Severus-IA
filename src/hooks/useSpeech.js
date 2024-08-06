import { useState, useEffect, useRef } from "react";

const useSpeech = (options) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [asistent, setAsistent] = useState(false); // cambio de IA asistente interactua con el SO

  const reconnitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Web speech api not supported");
      return;
    }
    reconnitionRef.current = new window.webkitSpeechRecognition();
    const recongnition = reconnitionRef.current;
    recongnition.interimResults = options.interimResults || true;
    recongnition.lang = options.lang || "es-ES";
    recongnition.continuous = options.continuous || false;

    recongnition.onresult = (event) => {
      let newText = "";
      for (let i = 0; i < event.results.length; i++) {
        newText += event.results[i][0].transcript;
      }

      setTranscript((prevText) => {
        const updatedText = prevText + " " + newText;
        checkForKeyword(updatedText);
        return updatedText;
      });
    };

    const checkForKeyword = (text) => {
      const keywordOn = "Asistente"; // Cambia esto a la palabra clave para activar
      const keywordOff = "Pregunta"; // Cambia esto a la palabra clave para desactivar

      if (text.includes(keywordOn || "asistente")) {
        setAsistent(true);
        const updatedText = text.replace(keywordOn || "asistente", "").trim();
        setTranscript(updatedText);
        console.log(isListening);
      } else if (text.includes(keywordOff || "pregunta")) {
        setAsistent(false);
        const updatedText = text.replace(keywordOff || "pregunta", "").trim();
        setTranscript(updatedText);
      }
    };

    recongnition.onerror = (event) => {
      console.log("Speech recongnition error:", event.error);
    };

    recongnition.onend = () => {
      setIsListening(false);
      setTranscript("");
    };

    return () => {
      recongnition.stop();
    };
  }, []);

  const startListening = () => {
    if (reconnitionRef.current && !isListening) {
      reconnitionRef.current.start();
      setIsListening(true);
    }
  };

  const stoptListening = () => {
    if (reconnitionRef.current && isListening) {
      reconnitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stoptListening,
    asistent,

  };
};

export default useSpeech;
