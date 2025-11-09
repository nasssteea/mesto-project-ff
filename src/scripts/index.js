import "../index.css";
import { createCard } from "./card.js";
import { openModal, closeModal, closeModalEvtListeners } from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js"
import { getUserData, getInitialCards, editUserData, addNewCard, editAvatar } from "./api.js"

// DOM узлы
const cardsContainer = document.querySelector(".places__list");

const profileEditButton = document.querySelector(".profile__edit-button");
const cardAddButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const editAvatarModal = document.querySelector(".popup_type_edit-avatar");
const avatarForm = editAvatarModal.querySelector(".popup__form");
const avatarLink = avatarForm.querySelector(".popup__input_type_url");

const profileModal = document.querySelector(".popup_type_edit");
const profileForm = profileModal.querySelector(".popup__form");
const nameInput = profileForm.querySelector(".popup__input_type_name");
const jobInput = profileForm.querySelector(".popup__input_type_description");

const newCardModal = document.querySelector(".popup_type_new-card");
const newCardForm = newCardModal.querySelector(".popup__form");
const newCardName = newCardForm.querySelector(".popup__input_type_card-name");
const newCardLink = newCardForm.querySelector(".popup__input_type_url");

const imageModal = document.querySelector(".popup_type_image");
const imageElement = imageModal.querySelector(".popup__image");
const imageCaption = imageModal.querySelector(".popup__caption");

export const validationSet = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
}; 

enableValidation(validationSet);

function renderLoading(isLoading, button, buttonText='Сохранить', loadingText='Сохранение...') {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = buttonText;
  }
}

const openImage = (evt) => {
  console.log(evt);
  imageElement.src = evt.target.src;
  imageElement.alt = evt.target.alt;
  imageCaption.textContent = evt.target.alt;
  openModal(imageModal);
};

// Вывести карточки на страницу
const addCard = (item, userId, openImage) => {
  const cardItem = createCard(item, userId, openImage);
  cardsContainer.append(cardItem);
};


//Функция открытия попапа редактирования профиля
function handleProfileFormSubmit (evt) {
  evt.preventDefault();
  renderLoading(true, evt.submitter);
  editUserData(nameInput.value, jobInput.value)
    .then((res) => {
      profileTitle.textContent = res.name;
      profileDescription.textContent = res.about;
      
      closeModal(profileModal);
      evt.target.reset();
    })
    .catch((err) => {
      console.log(`Что-то пошло не так: ${err}`);
    })
    .finally((res) => {
      renderLoading(false, evt.submitter);
    });
};

//Функция добавления новой карточки на страницу
function handleNewCardFormSubmit (evt) {
  evt.preventDefault();
  renderLoading(true, evt.submitter);
  addNewCard(newCardName.value, newCardLink.value)
    .then((res) => {
      const card = createCard(res, res.owner._id, openImage);
      cardsContainer.prepend(card);

      closeModal(newCardModal);
      evt.target.reset();
    })
    .catch((err) => {
      console.log(`Что-то пошло не так: ${err}`);
    })
    .finally((res) => {
      renderLoading(false, evt.submitter);
    });
};

//Функция редактирования аватара профиля
function handleAvatarFormSubmit (evt) {
  evt.preventDefault();
  renderLoading(true, evt.submitter);
  editAvatar(avatarLink.value)
    .then((res) => {
      profileAvatar.style = `background-image: url(${res.avatar})`;
      
      closeModal(editAvatarModal);
      evt.target.reset();
    })
    .catch((err) => {
      console.log(`Что-то пошло не так: ${err}`);
    })
    .finally((res) => {
      renderLoading(false, evt.submitter);
    });
};

// Обработчики событий
profileForm.addEventListener("submit", handleProfileFormSubmit);
newCardForm.addEventListener("submit", handleNewCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

profileEditButton.addEventListener("click", () => {
  clearValidation(profileForm, validationSet);
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(profileModal);
});

cardAddButton.addEventListener("click", () => {
  newCardName.value = "";
  newCardLink.value = "";
  clearValidation(newCardForm, validationSet);
  openModal(newCardModal);
});

profileAvatar.addEventListener("click", () => {
  avatarLink.value = "";
  clearValidation(avatarForm, validationSet);
  openModal(editAvatarModal);
});

//настраиваем обработчики закрытия попапов
closeModalEvtListeners(profileModal);
closeModalEvtListeners(newCardModal);
closeModalEvtListeners(imageModal);
closeModalEvtListeners(editAvatarModal);

Promise.all([getUserData(), getInitialCards()])
  .then(([userData, cards]) => {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style = `background-image: url(${userData.avatar})`;
    const userId = userData._id;
    cards.forEach((item) => {
      addCard(item, userId, openImage);
    });
  })
  .catch((err) => {
    console.log(
      `Что-то пошло не так: ${err}`
    );
  });