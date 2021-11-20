import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import Header from "./Header";
import Api from "../utils/Api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup ";
import Register from "./Register";
import LogIn from "./Login";
import InfoTooltip from "./InfoToolTip/InfoTooltip";
import RequireAuth from "./RequireAuth";

import {
    CurrentUserContext,
    currentUser,
} from "../contexts/CurrentUserContext";

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
        React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
        React.useState(false);
    const [isImageAvatarPopupOpen, setisImageAvatarPopupOpen] =
        React.useState(false);

    const [selectedCard, setSelectedCard] = React.useState({});

    const [currentUser, setCurrentUser] = React.useState({});

    const [cards, setCards] = React.useState([]);

    const [loaderEdit, setLoaderEdit] = React.useState(false);
    const [loaderAdd, setLoaderAdd] = React.useState(false);
    const [loaderAva, setLoaderAva] = React.useState(false);

    //ВАЛИДАЦИЯ---------------------------------------------------------
    const [validity, setValidity] = React.useState({
        isValid: {
            editName: true,
            editDescription: true,
            addName: false,
            addLink: false,
            avaLink: false,
        },
        message: {},
    });

    function handleValidity(input) {
        console.log(input.validity);
        if (input.validity.valid === true) {
            setValidity({
                // ...validity,
                isValid: { ...validity.isValid, [input.name]: true },
                message: { ...validity.message, [input.name]: "" },
            });
        } else if (input.validity.valueMissing === true) {
            setValidity({
                // ...validity,
                isValid: { ...validity.isValid, [input.name]: false },
                message: {
                    ...validity.message,
                    [input.name]: "Будь котиком, заполни пустое поле",
                },
            });
        } else if (input.validity.valid === false) {
            setValidity({
                // ...validity,
                isValid: { ...validity.isValid, [input.name]: false },
                message: {
                    ...validity.message,
                    [input.name]: input.validationMessage,
                },
            });
        }
    }
    //ВАЛИДАЦИЯ---------------------------------------------------------

    React.useEffect(() => {
        Api.getUserData()
            .then((data) => {
                setCurrentUser(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleImageAvatarPopupClick() {
        setisImageAvatarPopupOpen(true);
    }

    function handleCardClick(cardData) {
        setSelectedCard(cardData);
    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setisImageAvatarPopupOpen(false);
        setSelectedCard({});
    }

    function handleEsc(event) {
        if (event.key === `Escape`) {
            closeAllPopups();
        }
    }

    function handleUpdateUser(data) {
        setLoaderEdit(true);
        Api.sendUserData(data)
            .then((data) => {
                setCurrentUser(data);
            })
            .then(() => {
                setLoaderEdit(false);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleUpdatAvatar(data) {
        setLoaderAva(true);
        Api.changeAvatarRequest(data.avatar)
            .then((data) => {
                setCurrentUser(data);
            })
            .then(() => {
                setLoaderAva(false);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleAddPlaceSubmit(data) {
        setLoaderAdd(true);
        Api.sendUserCard(data)
            .then((data) => {
                setCards([data, ...cards]);
            })
            .then(() => {
                setLoaderAdd(false);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    //CARDS

    React.useEffect(() => {
        Api.getCards()
            .then((items) => {
                setCards(items);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function handleCardLike(card) {
        //Снова проверяем, есть ли уже лайк на этой карточке
        console.log(card);
        const isLiked = card.likes.some((i) => {
            return i._id === currentUser._id;
        });

        // Отправляем запрос в API и получаем обновлённые данные карточки
        Api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                console.log(newCard);
                setCards((cards) =>
                    cards.map((c) => (c._id === card._id ? newCard : c))
                );
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleDeleteClick(card) {
        Api.deleteCardRequest(card._id)
            .then((newCard) => {
                console.log(newCard);
                setCards((cards) => cards.filter((c) => c !== card));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="App">
                <Header />

                {/* <InfoTooltip
                    text="Вы успешно зарегистрировались!"
                    image="../images/Union.png"
                /> */}

                <Routes>
                    <Route path="/sign-in" element={<LogIn />} />
                    <Route path="/sign-up" element={<Register />} />

                    {/* <Route
path="/"
element={
  // Good! Do your composition here instead of wrapping <Route>.
  // This is really just inverting the wrapping, but it's a lot
  // more clear which components expect which props.
  <RequireAuth redirectTo="/sign-in">
    
  </RequireAuth>
} */}

                    <Route
                        path="/"
                        element={
                            <Main
                                currentUser={currentUser}
                                onEditProfile={handleEditProfileClick}
                                onAddPlace={handleAddPlaceClick}
                                onEditAvatar={handleEditAvatarClick}
                                onImagePopup={handleImageAvatarPopupClick}
                                onImage={handleCardClick}
                                cards={cards}
                                onCardLike={handleCardLike}
                                onCardDelete={handleDeleteClick}
                            />
                        }
                    />

                    <Route
                        path="/"
                        element={
                            <EditProfilePopup
                                validity={validity}
                                handleValidity={handleValidity}
                                handleEsc={handleEsc}
                                loader={loaderEdit}
                                onUpdateUser={handleUpdateUser}
                                isOpen={isEditProfilePopupOpen}
                                onClose={closeAllPopups}
                            />
                        }
                    />

                    <Route
                        path="/"
                        element={
                            <EditAvatarPopup
                                validity={validity}
                                handleValidity={handleValidity}
                                handleEsc={handleEsc}
                                loader={loaderAva}
                                onUpdateUser={handleUpdatAvatar}
                                isOpen={isEditAvatarPopupOpen}
                                onClose={closeAllPopups}
                            />
                        }
                    />

                    <Route
                        path="/"
                        element={
                            <AddPlacePopup
                                validity={validity}
                                handleValidity={handleValidity}
                                handleEsc={handleEsc}
                                loader={loaderAdd}
                                onAddCard={handleAddPlaceSubmit}
                                isOpen={isAddPlacePopupOpen}
                                onClose={closeAllPopups}
                            />
                        }
                    />

                    <Route
                        path="/"
                        element={
                            <PopupWithForm
                                title="Вы уверены?"
                                name="reset-avatar"
                                children={<></>}
                            />
                        }
                    />

                    <Route
                        path="/"
                        element={
                            <ImagePopup
                                isOpen={isImageAvatarPopupOpen}
                                name="press-image"
                                card={selectedCard}
                                onClose={closeAllPopups}
                            />
                        }
                    />

                    <Route path="/" element={<Footer />} />
                </Routes>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
