const config = {
    baseUrl: "https://nomoreparties.co/v1/web-magistracy-2",
    headers: {
      authorization: "68057835-f2cf-4e05-ab2f-390e204ea4c2",
      "Content-Type": "application/json",
    },
};

const checkResponse = (res) => {
    if(res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Что-то пошло не так: ${res.status}`);
    }
}

export const getUserData = () => {
    return fetch(`${config.baseUrl}/users/me`, {
      headers: config.headers,
    }).then(checkResponse);
};

export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
      headers: config.headers,
    }).then(checkResponse);
};

export const editUserData = (name, desc) => {
    return fetch(`${config.baseUrl}/users/me`, {
      method: "PATCH",
      headers: config.headers,
      body: JSON.stringify({
        name: name,
        about: desc,
      }),
    }).then(checkResponse);
};

export const addNewCard = (name, link) => {
    return fetch(`${config.baseUrl}/cards`, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify({
        name: name,
        link: link,
    }),
    }).then(checkResponse);
};

export const deleteCard = (card) => {
    return fetch(`${config.baseUrl}/cards/${card}`, {
      method: "DELETE",
      headers: config.headers,
    }).then(checkResponse);
};

export const addLikeCard = (cardId, isLiked) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: config.headers,
    }).then(checkResponse);
};

export const editAvatar = (url) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: config.headers,
      body: JSON.stringify({
        avatar: url
      })
    }).then(checkResponse);
};