
//Функция, которая показывает ошибку
const showInputError = (formElement, inputElement, errorMessage, validationSet) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(validationSet.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(validationSet.errorClass);
};

//Функция, которая скрывает ошибку
const hideInputError = (formElement, inputElement, validationSet) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(validationSet.inputErrorClass);
    errorElement.classList.remove(validationSet.errorClass);
    errorElement.textContent = "";
    inputElement.setCustomValidity("");
};

//Функция, которая проверяет наличие ошибки
const isValid = (formElement, inputElement, validationSet) => {
    if (inputElement.validity.patternMismatch) {
        inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
        inputElement.setCustomValidity("");
    }
    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage, validationSet);
    } else {
        hideInputError (formElement, inputElement, validationSet);
    }
};

const hasIsValidInput = (inputList) => {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    });
};

const toggleButtonState = (inputList, buttonElement, validationSet) => {
    if (hasIsValidInput(inputList)) {
        buttonElement.disabled = true;
        buttonElement.classList.add(validationSet.inactiveButtonClass);
    } else {
        buttonElement.disabled = false;
        buttonElement.classList.remove(validationSet.inactiveButtonClass);
    }
};

const setEventListeners = (formElement, validationSet) => {
    const inputList = Array.from(formElement.querySelectorAll(validationSet.inputSelector));
    const buttonElement = formElement.querySelector(validationSet.submitButtonSelector);
    toggleButtonState(inputList, buttonElement, validationSet);
    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", () => {
            isValid(formElement, inputElement, validationSet);
            toggleButtonState(inputList, buttonElement, validationSet);
        });
    });
};

export const enableValidation = (validationSet) => {
    const formList = Array.from(document.querySelectorAll(validationSet.formSelector));
    formList.forEach((formElement) => {
        formElement.addEventListener("submit", function (evt) {
            evt.preventDefault();
        });
        setEventListeners(formElement, validationSet);    
    });
};

export const clearValidation = (formElement, validationSet) => {
    const inputList = Array.from(formElement.querySelectorAll(validationSet.inputSelector));
    const buttonElement = formElement.querySelector(validationSet.submitButtonSelector);
    toggleButtonState(inputList, buttonElement, validationSet);
    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, validationSet);
    });
};