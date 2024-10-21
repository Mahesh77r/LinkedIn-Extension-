
import editIcon from "~/assets/edit.svg";
import insertIcon from "~/assets/insert.svg";
import generateIcon from "~/assets/generate.svg";
import regenerateIcon from "~/assets/regenerate.svg";
import ReactDOM from 'react-dom/client';
import { PopUpModal } from '../components/Modal'

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],

  main() {

    const renderModal = (parentElement:Element) => {
      
      const modalContainer = document.createElement("div");
      modalContainer.className = "pop-up-modal";
      document.body.appendChild(modalContainer);

      
      const root = ReactDOM.createRoot(modalContainer);
      root.render(<PopUpModal insertIcon={insertIcon} generateIcon={generateIcon} regenerateIcon={regenerateIcon} parentElement={parentElement}/>);

    }


    document.addEventListener("click", (e) => handleInputInteraction(e));
    document.addEventListener("focusin", (e) => handleInputInteraction(e));
    document.addEventListener("click", (e) => handleOutsideClick(e));
    document.addEventListener("click", (e) => handleOnClickEditIcon(e));



    const handleInputInteraction = (event: MouseEvent | FocusEvent) => {
      const target = event.target as HTMLElement;

      
      if (target.matches(".msg-form__contenteditable") || target.closest(".msg-form__contenteditable")) {
        const parentElement = target.closest(".msg-form__container") || target.closest(".msg-form__contenteditable");
        console.log(parentElement);
        if (parentElement) {
           renderModal(parentElement);

          parentElement.setAttribute("data-artdeco-is-focused", "true");

          
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

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (!target.matches(".msg-form__contenteditable") && !target.closest(".msg-form__contenteditable")) {
        const editIcons = document.querySelectorAll(".edit-icon");
        editIcons.forEach(icon => icon.remove());
      }
    }

    const handleOnClickEditIcon = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches(".edit-icon")) {
        openModal(event); 
      }
    }

    const openModal = (event: MouseEvent) => {
      const modalElement = document.getElementById("custom-modal");

      if (modalElement) {
        event.stopPropagation();
        modalElement.style.display = 'flex';
        modalElement.style.setProperty('display', 'flex', 'important');
        modalElement.classList.remove("hidden");

      }
    }

    const closeModal = () => {
      const modalElement = document.getElementById("custom-modal");
      if (modalElement) {
        modalElement.classList.add("hidden"); 
        // modalElement.style.setProperty('display', 'none', 'important'); 
      }
    }

    document.addEventListener("click", (event: MouseEvent) => {
      const modal = document.getElementById("custom-modal");
      const target = event.target as HTMLElement;

      if (modal && !modal.contains(target)) {
        closeModal();
      }
    });



  },
});






