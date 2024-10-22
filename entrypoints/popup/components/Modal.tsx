import React, { useState } from 'react';
import { Button } from './Button';
import '../App.css';

interface ModalProps {
  insertIcon: string;
  generateIcon: string;
  regenerateIcon: string;
  parentElement: Element;
}

export const PopUpModal: React.FC<ModalProps> = ({ insertIcon, generateIcon, regenerateIcon, parentElement }) => {
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

  const insertHandler = (event: any) => {
    const placeHolderClass = document.querySelector<HTMLElement>('.msg-form__placeholder');
    placeHolderClass?.removeAttribute('data-placeholder');

    let existingParagraph = parentElement?.querySelector('p');

    if (!existingParagraph) {
      existingParagraph = document.createElement('p');
      parentElement?.appendChild(existingParagraph);
    }

    existingParagraph.textContent = generateMessage();

    const modalElement = document.getElementById('custom-modal');
    if (modalElement) {
      modalElement?.style.setProperty('display', 'none', 'important');
    } else {
      console.log('Element not Found');
    }
  };

  const closeModal = (event: any) => {
    const content = document.getElementById('model-content');
    if (content && !content.contains(event.target)) {
      console.log('Clicked Outside');
    }
  };
  closeModal(MouseEvent);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 justify-center items-center z-[4000] hidden" id="custom-modal">
      <div className="bg-white rounded-lg w-full max-w-[570px] p-[24px]" id="model-content">
        {/* messages */}
        <div className="max-h-[200px] overflow-y-auto p-3 flex flex-col" id="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.type === 'user' ? 'self-end bg-[#DFE1E7]' : 'self-start bg-[#DBEAFE]'
              } text-[#666D80] rounded-lg p-2 mb-1 max-w-[80%]`}
            >
              {message.text}
            </div>
          ))}
        </div>

        {/* input box */}
        <div className="mb-3">
          <input
            id="input-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your prompt..."
            className="w-full p-4 mb-2 border border-gray-300 rounded"
          />
        </div>

        {/* buttons */}
        <div className="flex justify-end">
          {isGenerate && (
            <Button
              title="Insert"
              icon={insertIcon}
              onClick={(e) => insertHandler(e)}
              textSize="16px"
              bgColor="#fff"
              textColor="#666D80"
            />
          )}

          <Button
            title={!isGenerate ? 'Generate' : 'Regenerate'}
            icon={!isGenerate ? generateIcon : regenerateIcon}
            onClick={(e) => generateHandler(e)}
            textSize="16px"
            bgColor="#3B82F6"
            textColor="#fff"
          />
        </div>
      </div>
    </div>
  );
};
