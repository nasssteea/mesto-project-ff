import { deleteCard, addLikeCard } from "./api.js"

const cardTemplate = document.querySelector("#card-template").content;

function renderLikes(likes, likeButton, likeCounter, userId) {
  if (likes.length > 0) {
    likeCounter.textContent = likes.length;
  } else {
    likeCounter.textContent = "";
  }
  if (likes.some((user) => user._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  } else {
    likeButton.classList.remove("card__like-button_is-active");
  }
};

export function createCard(item, userId, openImage) {
  const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardElement.querySelector(".card__title").textContent = item.name;

  const deleteButton = cardElement.querySelector(".card__delete-button");

  if (item.owner._id === userId) {
    deleteButton.classList.add("card__delete-button_active");
    deleteButton.addEventListener("click", (evt) => {
      deleteCard(item._id)
        .then(() => {
          evt.target.closest(".places__item").remove();
        })
        .catch((err) => {
          console.log(`Что-то пошло не так: ${err}`);
        });
    });
  }

  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-counter");

  renderLikes(item.likes, likeButton, likeCounter, userId);

  likeButton.addEventListener("click", () => {
    addLikeCard(
      item._id,
      likeButton.classList.contains("card__like-button_is-active")
    )
      .then((res) => {
        renderLikes(res.likes, likeButton, likeCounter, userId);
      })
      .catch((err) => {
        console.log(`Что-то пошло не так: ${err}`);
      });
  });

  cardImage.addEventListener("click", openImage);
  return cardElement;
};