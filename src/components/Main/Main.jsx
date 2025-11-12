// import React, { useContext, useState } from 'react'
// import './Main.css'
// import { assets } from '../../assets/assets'
// import { Context } from '../../context/Context'

// const Main = () => {

//   const { onSent,
//     recentPrompt,
//     showResult,
//     loading,
//     resultData,
//     setInput,
//     input
//   } = useContext(Context);


//   return (
//     <div className='main'>
//       <div className="nav">
//         <p>Jarvis</p>
//         <img src={assets.user_icon} alt="" />
//       </div>
//       <div className="main-container">
//         {showResult
//           ? <div className="result">
//             <div className='result-title'>
//               <img src={assets.user_icon} alt="" />
//               <p>{recentPrompt}</p>
//             </div>
//             <div className="result-data">
//               <img src={assets.gemini_icon} alt="" />
//               {loading
//                 ? <div className="loader">
//                   <hr className="animated-bg" />
//                   <hr className="animated-bg" />
//                   <hr className="animated-bg" />
//                   <hr className="animated-bg" />
//                   <hr className="animated-bg" />
//                   <hr className="animated-bg" />
//                   <hr className="animated-bg" />
//                   <hr className="animated-bg" />
//                   <hr className="animated-bg" />
//                   <hr className="animated-bg" />
//                   <hr className="animated-bg" />
//                 </div>
//                 : <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
//               }
//             </div>

//           </div>
//           : <>
//             <div className="greet">
//               <p><span>Hello, Sir</span></p>
//               <p>How can I help you?</p>
//             </div>
//             <div className="cards">
//               <div className="card">
//                 <p>I can search your prompt whatever you have given in searchbox.</p>
//                 <img src={assets.compass_icon} alt="" />
//               </div>
//               <div className="card">
//                 <p>I can suggest you things like a normal chatbot.</p>
//                 <img src={assets.bulb_icon} alt="" />
//               </div>
//               <div className="card">
//                 <p>I can perform most of the task like Jarvis Ai. I can be a part of Jarvis Ai.</p>
//                 <img src={assets.message_icon} alt="" />
//               </div>
//               <div className="card">
//                 <p>I can improve myself on each question you asked.</p>
//                 <img src={assets.code_icon} alt="" />
//               </div>
//             </div>
//           </>
//         }



//         <div className="main-bottom">
//           <div className="search-box">
//             <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
//             <div>
//               <img src={assets.gallery_icon} width={30} alt="" />
//               <img src={assets.mic_icon} width={30} alt="" />
//               {input ? <img onClick={() => onSent()} src={assets.send_icon} width={30} alt="" /> : null}
//             </div>
//           </div>
//           <p className="bottom-info">
//             This model is powered by Genai.api, this may display inaccurate info, including about people, places etc. You have to click "+" icon for every new chat you want.
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Main
import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets' 
import { Context } from '../../context/Context'

const Main = () => {

    const { 
        onSent, recentPrompt, showResult, loading, resultData, setInput, input,
        isMicListening, toggleMic 
    } = useContext(Context);

    const cardPromptHandler = async (prompt) => {
        setInput(prompt); 
        await onSent(prompt); 
    }

    const sendHandler = () => {
        if (input.trim() !== "") {
              onSent();
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendHandler();
        }
    };

    return (
        <div className='main'>
            <div className="nav">
                <p>Jarvis</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">
                {showResult
                    ? <div className="result">
                        <div className='result-title'>
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {loading
                                ? <div className="loader">
                                    <hr className="animated-bg" />
                                    <hr className="animated-bg" />
                                    <hr className="animated-bg" />
                                    <hr className="animated-bg" />
                                    <hr className="animated-bg" />
                                    <hr className="animated-bg" />
                                    <hr className="animated-bg" />
                                    <hr className="animated-bg" />
                                </div>
                                : <p dangerouslySetInnerHTML={{ __html: resultData }}></p> 
                            }
                        </div>
                    </div>
                    : <>
                        <div className="greet">
                            <p><span>Hello, Sir</span></p>
                            <p>How can I help you?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => cardPromptHandler("Suggest beautiful places to see on an upcoming road trip")}>
                                <p>Suggest beautiful places to see on an upcoming road trip</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => cardPromptHandler("Briefly summarize this concept: urban planning")}>
                                <p>Briefly summarize this concept: urban planning</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => cardPromptHandler("Brainstorm team bonding activities for our work retreat")}>
                                <p>Brainstorm team bonding activities for our work retreat</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => cardPromptHandler("Improve the readability of the following code")}>
                                <p>Improve the readability of the following code</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                }

                <div className="main-bottom">
                    <div className="search-box">
                        <input 
                            onChange={(e) => setInput(e.target.value)} 
                            value={input} 
                            type="text" 
                            placeholder={isMicListening ? 'Listening... speak now.' : 'Enter a prompt here'} // Update placeholder
                            onKeyDown={handleKeyDown} 
                            disabled={isMicListening} // Disable typing while recording
                        />
                        <div>
                            <img src={assets.gallery_icon} width={30} alt="" />
                            
                            {/* ATTACHING TOGGLE MIC */}
                            <img 
                                onClick={toggleMic} 
                                src={assets.mic_icon} 
                                width={30} 
                                alt="Microphone" 
                                // Optional: Add a class to change the icon style when listening (e.g., make it red)
                                className={isMicListening ? 'mic-listening' : ''} 
                            />
                            
                            {input && input !== 'Listening...' ? <img onClick={sendHandler} src={assets.send_icon} width={30} alt="" /> : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        This model is powered by Genai.api, this may display inaccurate info, including about people, places etc. You have to click "+" icon for every new chat you want.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main
