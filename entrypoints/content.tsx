// Importing necessary assets (icons) for the extension UI
import editIcon from "~/assets/edit.svg";
import insertIcon from "~/assets/insert.svg";
import generateIcon from "~/assets/generate.svg";
import regenerateIcon from "~/assets/regenerate.svg";
import ReactDOM from 'react-dom/client';
import React, { useState } from 'react'; // Import useState for modal state management

export default defineContentScript({
  // website links in which extension is going to work
  matches: ["*://*.linkedin.com/*"],

  main() {
    // Render the modal into the document
    renderModal();

    function renderModal() {
      console.log("Modal Rendered");
      // Create a div element to contain the modal
      const modalContainer = document.createElement("div");
      modalContainer.className = "pop-up-modal";
      document.body.appendChild(modalContainer);

      // Render the PopUpModal component into the modalContainer
      const root = ReactDOM.createRoot(modalContainer);
      root.render(<PopUpModal insertIcon={insertIcon} generateIcon={generateIcon} regenerateIcon={regenerateIcon} />);


    }


    document.addEventListener("click", handleInputInteraction);
    document.addEventListener("focusin", handleInputInteraction);
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("click", handleOnClickEditIcon);



    function handleInputInteraction(event: MouseEvent | FocusEvent) {
      const target = event.target as HTMLElement;

      // Check if the clicked element is inside the content editable
      if (target.matches(".msg-form__contenteditable") || target.closest(".msg-form__contenteditable")) {
        const parentElement = target.closest(".msg-form__container") || target.closest(".msg-form__contenteditable");

        if (parentElement) {
          parentElement.setAttribute("data-artdeco-is-focused", "true");

          // Only add the icon if it doesn't already exist
          if (!parentElement.querySelector(".edit-icon")) {
            const icon = document.createElement("img");
            icon.className = "edit-icon";
            icon.src = editIcon;
            icon.alt = "Custom Icon";
            icon.style.position = "absolute";
            icon.style.bottom = "5px";
            icon.style.right = "5px";
            icon.style.width = "30px";
            icon.style.height = "30px";
            icon.style.cursor = "pointer";
            icon.style.zIndex = "1000";
            parentElement.appendChild(icon);
          }
        }
      }
    }

    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      // Check if the click is outside the content editable
      if (!target.matches(".msg-form__contenteditable") && !target.closest(".msg-form__contenteditable")) {
        // Remove the edit icon if it exists
        const editIcons = document.querySelectorAll(".edit-icon");
        editIcons.forEach(icon => icon.remove());
      }
    }

    function handleOnClickEditIcon(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.matches(".edit-icon")) {
        console.log("Edit Icon Clicked");
        openModal(event); // Call the function to open the modal
      }
    }

    function openModal(event: MouseEvent) {
      const modalElement = document.getElementById("custom-modal");
      console.log("Open Modal")
      if (modalElement) {
        event.stopPropagation();
        modalElement.style.display = 'flex';
        modalElement.style.setProperty('display', 'flex', 'important'); // Adds `display: flex !important`
        modalElement.classList.remove("hidden");
        console.log("All Done");

      }
    }

    function closeModal() {
      const modalElement = document.getElementById("custom-modal");
      if (modalElement) {
        modalElement.classList.add("hidden"); // Add hidden class to hide the modal
      }
    }

    document.addEventListener("click", (event: MouseEvent) => {
      const modal = document.getElementById("custom-modal");
      const target = event.target as HTMLElement;

      if (modal && !modal.contains(target)) {
        closeModal(); // Close the modal if clicked outside
      }
    });



  },
});

interface ModalProps {
  insertIcon: string;
  generateIcon: string;
  regenerateIcon: string;
}

const modalStyle = {
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
  padding: '20px',
};

// Define the PopUpModal component
const PopUpModal: React.FC<ModalProps> = ({ insertIcon, generateIcon, regenerateIcon }) => {
  const [text, setText] = useState('');
  const [isGenerate, setGenerate] = useState(false);

  const generateMessage = () => {
    const messages = [
      "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.",
    ];
    return messages[0]; // Return a fixed generated message
  };

  const generateHandler = (e: any) => {
    e.stopPropagation();

    const inputValue = text.trim();
    if (!inputValue) return;

    setGenerate(true);
  }

  return (
    <div style={modalStyle} id="custom-modal">
      <div style={contentStyle} id="model-content">
        {/* messages */}
        <div id="messages" style={{ marginTop: '10px', maxHeight: '200px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column' }}>
        </div>

        {/* input box */}
        <div style={{ marginBottom: '10px' }}>
          <input id="input-text" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your prompt..." style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        {/* buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          {isGenerate && (
            <Button
              title="Insert"
              icon={insertIcon}
              onClick={() => console.log('Insert clicked')}
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



interface ButtonProps {
  title: string;
  icon: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  textSize?: string;
}

const Button: React.FC<ButtonProps> = ({ title, icon, onClick, style, buttonStyle, textSize = '16px' }) => {
  return (
    <button
      style={{
        background: '#fff',
        color: '#666D80',
        padding: '8px 16px',
        border: '2px solid #666D80',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
        ...buttonStyle,
      }}
      onClick={onClick}
    >
      <img
        src={icon}
        alt={title}
        style={{
          verticalAlign: 'middle',
          marginRight: '5px',
          width: '14px',
          height: '14px',
          ...style,
        }}
      />
      <b style={{ fontSize: textSize }}>{title}</b>
    </button>
  );
};

