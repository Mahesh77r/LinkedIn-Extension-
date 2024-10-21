import React,{useState} from 'react';
import {Button} from './Button'

interface ModalProps {
    insertIcon: string;
    generateIcon: string;
    regenerateIcon: string;
    parentElement:Element;
  }
  
  let modalStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4000,
  };
  
  const contentStyle = {
    background: 'white',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '570px',
    padding: '8px 24px 24px',
  };
  

export const PopUpModal: React.FC<ModalProps> = ({ insertIcon, generateIcon, regenerateIcon,parentElement }) => {
    const [text, setText] = useState('');
    const [isGenerate, setGenerate] = useState(false);
    const [messages, setMessages] = useState<{ text: string; type: 'user' | 'generated' }[]>([]);
  
    const generateMessage = () => {
      const messages = [
        "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.",
      ];
      return messages[0]; 
    };
  
    const generateHandler = (e: any) => {
      e.stopPropagation();
  
      const inputValue = text.trim();
      if (!inputValue) return;
    
      setMessages((prevMessages) => [...prevMessages, { text: inputValue, type: 'user' }]);
      
      const generatedReply = generateMessage();
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { text: generatedReply, type: 'generated' }]);
      }, 500);
      
  
      setGenerate(true);
      setText(''); 
    };
  
    const insertHandler = (event:any) =>{
      
        const placeHolderClass = document.querySelector<HTMLElement>('.msg-form__placeholder');
        placeHolderClass?.removeAttribute('data-placeholder');
        
      
      let existingParagraph = parentElement?.querySelector("p");
      
      if (!existingParagraph) {
        console.log("p not exists ")
        existingParagraph = document.createElement("p");
        parentElement?.appendChild(existingParagraph);
      }
     
      existingParagraph.textContent = generateMessage();


      const modalElement = document.getElementById("custom-modal");
      if(modalElement){ 
        modalElement?.style.setProperty('display', 'none', 'important');
      }
      else{
        console.log("Element not Found")
      }

    };
  
    return (
      <div style={modalStyle} id="custom-modal">
        <div style={contentStyle} id="model-content">
          {/* messages */}
          <div id="messages" style={{  maxHeight: '200px', overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: message.type === 'user' ? '#DFE1E7' : '#DBEAFE',
                  color: '#666D80',
                  borderRadius: '10px',
                  padding: '10px',
                  marginBottom: '5px',
                  maxWidth: '80%',
                }}
              >
                {message.text}
              </div>
            ))}
          </div>
  
          {/* input box */}
          <div style={{ marginBottom: '12px' }}>
            <input
              id="input-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your prompt..."
              style={{ width: '100%', padding: '18px', marginBottom:'8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
  
          {/* buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
            {isGenerate && (
              <Button
                title="Insert"
                icon={insertIcon}
                onClick={(e) => insertHandler(e)}
                textSize="16px"
                buttonStyle={{ background: '#fff', color: '#666D80', border: '2px solid #666D80' }}
              />
            )}
  
            <Button
              title={!isGenerate ? 'Generate' : 'Regenerate'}
              icon={!isGenerate ? generateIcon : regenerateIcon}
              onClick={(e) => generateHandler(e)}
              textSize="16px"
              buttonStyle={{ background: '#007bff', color: 'white', border: '2px solid #007bff' }}
            />
          </div>
        </div>
      </div>
    );
  };