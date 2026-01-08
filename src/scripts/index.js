import "../index.css";
import { createCard } from "./card.js";
import { openModal, closeModal } from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import { getUserData, getInitialCards, editUserData, addNewCard, editAvatar } from "./api.js";


const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
};

const cardsContainer = document.querySelector(".places__list");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
const profileEditButton = document.querySelector(".profile__edit-button");
const cardAddButton = document.querySelector(".profile__add-button");

const popupEditProfile = document.querySelector(".popup_type_edit");
const editProfileForm = popupEditProfile.querySelector(".popup__form");
const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const jobInput = editProfileForm.querySelector(".popup__input_type_description");

const popupAddCard = document.querySelector(".popup_type_new-card");
const addCardForm = popupAddCard.querySelector(".popup__form");
const cardNameInput = addCardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = addCardForm.querySelector(".popup__input_type_url");

const popupEditAvatar = document.querySelector(".popup_type_edit-avatar");
const editAvatarForm = popupEditAvatar.querySelector(".popup__form");
const avatarInput = editAvatarForm.querySelector(".popup__input_type_url");

const popupImage = document.querySelector(".popup_type_image");
const imageElement = popupImage.querySelector(".popup__image");
const imageCaption = popupImage.querySelector(".popup__caption");

function renderLoading(isLoading, button, buttonText = 'Сохранить', loadingText = 'Сохранение...') {
  button.textContent = isLoading ? loadingText : buttonText;
  button.disabled = isLoading;
}

const openImage = (cardData) => {
  imageElement.src = cardData.link;
  imageElement.alt = cardData.name;
  imageCaption.textContent = cardData.name;
  openModal(popupImage);
};

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(true, submitButton);

  editUserData(nameInput.value, jobInput.value)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(popupEditProfile);
    })
    .catch((err) => console.log(`Ошибка при обновлении профиля: ${err}`))
    .finally(() => renderLoading(false, submitButton));
}

function handleNewCardFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(true, submitButton);

  addNewCard(cardNameInput.value, cardLinkInput.value)
    .then((cardData) => {
      const newCard = createCard(cardData, cardData.owner._id, openImage);
      cardsContainer.prepend(newCard);

      closeModal(popupAddCard);
      evt.target.reset();
      clearValidation(addCardForm, validationConfig);
    })
    .catch((err) => console.log(`Ошибка при добавлении карточки: ${err}`))
    .finally(() => renderLoading(false, submitButton));
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(true, submitButton);

  editAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(popupEditAvatar);
      evt.target.reset();
      clearValidation(editAvatarForm, validationConfig);
    })
    .catch((err) => console.log(`Ошибка при обновлении аватара: ${err}`))
    .finally(() => renderLoading(false, submitButton));
}

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(editProfileForm, validationConfig);
  openModal(popupEditProfile);
});

cardAddButton.addEventListener("click", () => {
  openModal(popupAddCard);
});

profileAvatar.addEventListener("click", () => {
  openModal(popupEditAvatar);
});

editProfileForm.addEventListener("submit", handleProfileFormSubmit);
addCardForm.addEventListener("submit", handleNewCardFormSubmit);
editAvatarForm.addEventListener("submit", handleAvatarFormSubmit);

Promise.all([getUserData(), getInitialCards()])
  .then(([userData, cards]) => {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((cardData) => {
      const card = createCard(cardData, userData._id, openImage);
      cardsContainer.append(card);
    });
  })
  .catch((err) => console.log(`Ошибка при загрузке начальных данных: ${err}`));

enableValidation(validationConfig);