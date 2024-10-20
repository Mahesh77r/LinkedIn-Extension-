// Importing necessary assets (icons) for the extension UI
import editIcon from "~/assets/edit.svg";
import insertIcon from "~/assets/insert.svg";
import generateIcon from "~/assets/generate.svg";
import regenerateIcon from "~/assets/regenerate.svg";
import ReactDOM from 'react-dom/client';

export default defineContentScript({
  // website links in which extension is going to work
  matches: ["*://*.linkedin.com/*"],

  main() {
    // Single event listener for click and focus
    document.addEventListener("click", handleInputInteraction);
    document.addEventListener("focusin", handleInputInteraction);
    document.addEventListener("click", handleOutsideClick); // Listener for outside click

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
  },
});

interface ModalProps {
  insertIcon: string;
  generateIcon: string;
}

const PopUpModal: React.FC<ModalProps> = ({ insertIcon, generateIcon }) => {
  return (
    <div id="custom-modal" className="fixed inset-0 bg-black bg-opacity-50 hidden justify-center items-center z-[4000]">
      <div id="modal-content" className="bg-white rounded-lg w-full max-w-[570px] p-5">
        <div id="messages" className="mt-2 max-h-[200px] overflow-y-auto p-2 flex flex-col"></div>
        <div className="mb-2">
          <input id="input-text" type="text" placeholder="Enter your prompt..." className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div className="text-right mt-3">
          <button id="insert-btn" className="bg-white text-gray-600 py-2 px-4 border border-gray-600 rounded-md cursor-pointer hidden mr-2">
            <img src={insertIcon} alt="Insert" className="inline mr-1 w-[14px] h-[14px]" />
            <b>Insert</b>
          </button>
          <button id="generate-btn" className="bg-blue-500 text-white py-2 px-4 border border-blue-500 rounded-md cursor-pointer">
            <img src={generateIcon} alt="Generate" className="inline mr-1 w-[14px] h-[14px]" />
            <b>Generate</b>
          </button>
        </div>
      </div>
    </div>
  )
}
