// import { createContext, useState } from "react";
// import runChat from "../config/gemini";

// export const Context = createContext();

// const ContextProvider = (props) => {

//     const [prevPrompts, setPrevPrompts] = useState([]);
//     const [input, setInput] = useState("");
//     const [recentPrompt, setRecentPrompt] = useState("");
//     const [showResult, setShowResult] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [resultData, setResultData] = useState("")


//     function delayPara(index, nextWord) {
//         // setTimeout(function () {
//         // }, 75 * index);
//         setResultData(prev => prev + nextWord)
//     }

//     const onSent = async (prompt) => {

//         setResultData("")
//         setLoading(true)
//         setShowResult(true)
//         let response;
//         if (prompt !== undefined) {
//             response = await runChat(prompt);
//             setRecentPrompt(prompt)
//         }
//         else {
//             setPrevPrompts(prev => [...prev, input]);
//             setRecentPrompt(input)
//             response = await runChat(input);
//         }
//         let responseArray = response.split('**');
//         let newArray = "";
//         for (let i = 0; i < responseArray.length; i++) {
//             if (i === 0 || i % 2 !== 1) {
//                 newArray += responseArray[i]
//             }
//             else {
//                 newArray += "<b>" + responseArray[i] + "</b>"
//             }
//         }
//         console.log(newArray);
//         responseArray = newArray.split('*').join("</br>").split(" ");
//         for (let i = 0; i < responseArray.length; i++) {
//             const nextWord = responseArray[i];
//             delayPara(i, nextWord + " ")
//         }
//         setLoading(false);
//         setInput("")
//     }

//     const newChat = async () => {
//         setLoading(false);
//         setShowResult(false);
//     }

//     const contextValue = {
//         prevPrompts,
//         setPrevPrompts,
//         onSent,
//         setRecentPrompt,
//         recentPrompt,
//         showResult,
//         loading,
//         resultData,
//         input,
//         setInput,
//         newChat
//     }

//     return (
//         <Context.Provider value={contextValue}>
//             {props.children}
//         </Context.Provider>
//     )
// }

// export default ContextProvider
import { createContext, useState } from "react";
import runChat from "../config/gemini"; 
import DOMPurify from 'dompurify';

export const Context = createContext();

// Define SpeechRecognition for browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; 
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// Configure recognition instance
if (recognition) {
    recognition.continuous = false; // Stops after one phrase
    recognition.interimResults = false;
    recognition.lang = 'en-US'; 
}


const ContextProvider = (props) => {

    const [prevPrompts, setPrevPrompts] = useState([]);
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [isMicListening, setIsMicListening] = useState(false); // New state for mic

    // --- TEXT-TO-SPEECH FUNCTION ---
    const speakResult = (textToSpeak) => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            window.speechSynthesis.speak(utterance);
        }
    };
    
    // --- TYPING EFFECT FUNCTION ---
    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 50 * index); 
    };

    // --- SPEECH-TO-TEXT FUNCTION  ---
    const toggleMic = () => {
        if (!recognition) {
            alert("Your browser does not support Speech Recognition.");
            return;
        }

        if (!isMicListening) {
            // Start Listening
            recognition.start();
            setIsMicListening(true);
            setInput("Listening..."); // Optional: Give visual feedback in the input box

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                
                // Set the transcribed text as the input, and send it
                setInput(transcript); 
                onSent(transcript); 
            };

            recognition.onend = () => {
                // Ensure state is reset
                setIsMicListening(false);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                alert(`Microphone Error: ${event.error}`);
                setIsMicListening(false);
                setInput("");
            };

        } else {
            // Stop Listening
            recognition.stop();
            setIsMicListening(false);
        }
    };
    
    // --- MAIN EXECUTION FUNCTION ---
    const onSent = async (prompt) => {

        setResultData("");
        setLoading(true);
        setShowResult(true);
        
        let finalPrompt = prompt !== undefined ? prompt : input;

        if (prompt === undefined) {
            setPrevPrompts(prev => [...prev, input]);
        }
        setRecentPrompt(finalPrompt);
        setInput("");

        const response = await runChat(finalPrompt);

        // 1. Formatting and Sanitization
        let formattedHTML = response.split('**').map((segment, index) => {
            return index % 2 !== 0 ? `<b>${segment}</b>` : segment;
        }).join('');
        
        formattedHTML = formattedHTML.split('*').join("</br>");
        const sanitizedHTML = DOMPurify.sanitize(formattedHTML);
        
        // 2. Prepare text for speech
        const textForSpeech = sanitizedHTML.replace(/<[^>]*>/g, '').replace(/(\s\s+)/g, ' ');

        // 3. Start Typing Effect
        const words = sanitizedHTML.split(" ");
        for (let i = 0; i < words.length; i++) {
            delayPara(i, words[i] + " ");
        }
        
        // 4. Start Speech
        setTimeout(() => {
            speakResult(textForSpeech);
        }, 50 * words.length + 500); 

        setLoading(false);
    }

    const newChat = async () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        setLoading(false);
        setShowResult(false);
    }

    const contextValue = {
        prevPrompts, setPrevPrompts, onSent, setRecentPrompt, recentPrompt, 
        showResult, loading, resultData, input, setInput, newChat,
        isMicListening, toggleMic // EXPORT NEW MIC HANDLERS
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;