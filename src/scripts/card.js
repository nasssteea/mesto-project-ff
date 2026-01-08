import { deleteCard, addLikeCard } from "./api.js";

const cardTemplate = document.querySelector("#card-template").content;

const updateLikeStatus = (likes, likeButton, likeCounter, userId) => {
  const isLiked = likes.some((user) => user._id === userId);

  likeButton.classList.toggle("card__like-button_is-active", isLiked);

  likeCounter.textContent = likes.length > 0 ? likes.length : "";
};

export function createCard(cardData, userId, onImageClick) {
  const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-counter");

  const cardId = cardData._id;

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  if (cardData.owner._id === userId) {
    deleteButton.classList.add("card__delete-button_active");
    deleteButton.addEventListener("click", () => {
      deleteCard(cardId)
        .then(() => {
          cardElement.remove();
        })
        .catch((err) => console.error(`Ошибка при удалении: ${err}`));
    });
  }

  updateLikeStatus(cardData.likes, likeButton, likeCounter, userId);

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-button_is-active");

    addLikeCard(cardId, isLiked)
      .then((res) => {
        updateLikeStatus(res.likes, likeButton, likeCounter, userId);
      })
      .catch((err) => console.error(`Ошибка лайка: ${err}`));
  });

  cardImage.addEventListener("click", () => {
    onImageClick(cardData);
  });

  return cardElement;
}
