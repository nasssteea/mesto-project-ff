const config = {
  baseUrl: "https://nomoreparties.co/v1/web-magistracy-2",
  headers: {
    authorization: "68057835-f2cf-4e05-ab2f-390e204ea4c2",
    "Content-Type": "application/json",
  },
};

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

const request = (endpoint, options) => {
  return fetch(`${config.baseUrl}${endpoint}`, options).then(checkResponse);
};

export const getUserData = () => {
  return request("/users/me", {
    headers: config.headers,
  });
};

export const getInitialCards = () => {
  return request("/cards", {
    headers: config.headers,
  });
};

export const editUserData = (name, about) => {
  return request("/users/me", {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ name, about }),
  });
};

export const addNewCard = (name, link) => {
  return request("/cards", {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({ name, link }),
  });
};

export const deleteCard = (cardId) => {
  return request(`/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  });
};

export const addLikeCard = (cardId, isLiked) => {
  return request(`/cards/likes/${cardId}`, {
    method: isLiked ? "DELETE" : "PUT",
    headers: config.headers,
  });
};

export const editAvatar = (avatarUrl) => {
  return request("/users/me/avatar", {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarUrl,
    }),
  });
};
