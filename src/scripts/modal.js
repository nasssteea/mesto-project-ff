export function openModal(modal) {
    modal.classList.add("popup_is-opened");
    document.addEventListener("keydown", closeByEsc);
};

export function closeModal(modal) {
    modal.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", closeByEsc);
};

function closeByEsc(evt) {
    if (evt.key === "Escape") {
        const popupActive = document.querySelector(".popup_is-opened");
        closeModal(popupActive);
    }
};

export function closeModalEvtListeners(modal) {
    const closeButtonElement = modal.querySelector(".popup__close")
    closeButtonElement.addEventListener("click", () => {
        closeModal(modal);
    });

    modal.addEventListener("mousedown", (evt) => {
        if (evt.target.classList.contains("popup")) {
          closeModal(modal);
        }
      });
};
