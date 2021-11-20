import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useNavigate,
} from "react-router-dom";

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
import NavButton from "./Nav/NavButton";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import react from "react";

function App() {
    const history = useNavigate();
    const [loggedIn, setLoggedIn] = React.useState(false);
    //ПОПАПЫ---------------------------------------------------------
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
        React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
        React.useState(false);
    const [isImageAvatarPopupOpen, setisImageAvatarPopupOpen] =
        React.useState(false);

    const [isAuthPopupOpen, setisAuthPopupOpen] = React.useState(false);
    const [isRegSucces, setisRegSucces] = React.useState("");
    //ПОПАПЫ_________________________________________________________

    //ЮЗЕР И КАРТОЧКИ_---------------------------------------------------
    const [selectedCard, setSelectedCard] = React.useState({});

    const [currentUser, setCurrentUser] = React.useState({});

    const [cards, setCards] = React.useState([]);

    const [mail, setMail] = React.useState("");
    //ЮЗЕР И КАРТОЧКИ___________________________________________________

    //ИКОНКА ЗАГРУЗКИ---------------------------------------------------
    const [loaderEdit, setLoaderEdit] = React.useState(false);
    const [loaderAdd, setLoaderAdd] = React.useState(false);
    const [loaderAva, setLoaderAva] = React.useState(false);
    //ИКОНКА ЗАГРУЗКИ___________________________________________________

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
    //ВАЛИДАЦИЯ_________________________________________________________

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
        setisAuthPopupOpen(false);
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
        const isLiked = card.likes.some((i) => {
            return i._id === currentUser._id;
        });

        // Отправляем запрос в API и получаем обновлённые данные карточки
        Api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
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
                setCards((cards) => cards.filter((c) => c !== card));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleRegistrationSubmit(data) {
        Api.registration("https://auth.nomoreparties.co", data)
            .then((regData) => {
                history("/sign-in");
                setisAuthPopupOpen(true);
                setisRegSucces(true);
                // if (regData.data._id) {
                //     setisRegSucces(true);
                // }
            })
            .catch((err) => {
                setisAuthPopupOpen(true);
                setisRegSucces(false);

                console.log(err);
            });
    }
    function handleLogInSubmit(data) {
        Api.authorization("https://auth.nomoreparties.co", data)
            .then((logInData) => {
                localStorage.setItem("token", logInData.token);
                setLoggedIn(true);

                history("/");

                return logInData;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    React.useEffect(() => {
        handleTokenCheck();
        console.log("USEeffect");
    }, [loggedIn]);
    function handleTokenCheck() {
        const myToken = localStorage.getItem("token");
        if (myToken) {
            Api.checkToken("https://auth.nomoreparties.co", myToken)
                .then((logInData) => {
                    setMail(logInData.data.email);
                    console.log(logInData.data.email);
                    if (logInData) {
                        setLoggedIn(true);

                        history("/");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function handleExitAccount() {
        setMail("");
        localStorage.removeItem("token");
        setLoggedIn(false);
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="App">
                <InfoTooltip
                    success={isRegSucces}
                    onClose={closeAllPopups}
                    handleEsc={handleEsc}
                    isOpened={isAuthPopupOpen}
                />

                <Routes>
                    <Route
                        path="/sign-in"
                        element={
                            <>
                                <Header
                                    children={
                                        <>
                                            <NavButton
                                                email={false}
                                                buttonText="Регистрация"
                                                redirect="/sign-up"
                                            />
                                        </>
                                    }
                                />
                                <LogIn onSubmit={handleLogInSubmit} />
                            </>
                        }
                    />
                    <Route
                        path="/sign-up"
                        element={
                            <>
                                <Header
                                    children={
                                        <>
                                            <NavButton
                                                email={false}
                                                buttonText="Войти"
                                                redirect="/sign-in"
                                            />
                                        </>
                                    }
                                />
                                <Register onSubmit={handleRegistrationSubmit} />
                            </>
                        }
                    />

                    <Route
                        exact
                        path="/"
                        element={
                            <RequireAuth
                                redirectTo="/sign-in"
                                loggedIn={loggedIn}
                            >
                                <>
                                    <Header
                                        children={
                                            <>
                                                <NavButton
                                                    loggedIn={loggedIn}
                                                    onClick={handleExitAccount}
                                                    email={
                                                        <h3 className="nav__email">
                                                            {mail}
                                                        </h3>
                                                    }
                                                    buttonText="Выход"
                                                    redirect="/sign-in"
                                                />
                                            </>
                                        }
                                    />
                                    <Main
                                        currentUser={currentUser}
                                        onEditProfile={handleEditProfileClick}
                                        onAddPlace={handleAddPlaceClick}
                                        onEditAvatar={handleEditAvatarClick}
                                        onImagePopup={
                                            handleImageAvatarPopupClick
                                        }
                                        onImage={handleCardClick}
                                        cards={cards}
                                        onCardLike={handleCardLike}
                                        onCardDelete={handleDeleteClick}
                                    />
                                    <EditProfilePopup
                                        validity={validity}
                                        handleValidity={handleValidity}
                                        handleEsc={handleEsc}
                                        loader={loaderEdit}
                                        onUpdateUser={handleUpdateUser}
                                        isOpen={isEditProfilePopupOpen}
                                        onClose={closeAllPopups}
                                    />
                                    <EditAvatarPopup
                                        validity={validity}
                                        handleValidity={handleValidity}
                                        handleEsc={handleEsc}
                                        loader={loaderAva}
                                        onUpdateUser={handleUpdatAvatar}
                                        isOpen={isEditAvatarPopupOpen}
                                        onClose={closeAllPopups}
                                    />
                                    <AddPlacePopup
                                        validity={validity}
                                        handleValidity={handleValidity}
                                        handleEsc={handleEsc}
                                        loader={loaderAdd}
                                        onAddCard={handleAddPlaceSubmit}
                                        isOpen={isAddPlacePopupOpen}
                                        onClose={closeAllPopups}
                                    />
                                    <PopupWithForm
                                        title="Вы уверены?"
                                        name="reset-avatar"
                                        children={<></>}
                                    />
                                    <ImagePopup
                                        isOpen={isImageAvatarPopupOpen}
                                        name="press-image"
                                        card={selectedCard}
                                        onClose={closeAllPopups}
                                    />
                                    <Footer />{" "}
                                </>
                            </RequireAuth>
                        }
                    />
                </Routes>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
