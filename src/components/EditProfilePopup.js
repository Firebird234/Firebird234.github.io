import React from "react";
import PopupWithForm from "./PopupWithForm";
import {
    CurrentUserContext,
    currentUser,
} from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
    const currentUser = React.useContext(CurrentUserContext);

    const [inputName, setName] = React.useState({
        editName: "",
        editDescription: "",
    });

    // const [validButton, setvalidButton] = React.useState();

    // function handleValidButton() {
    //     console.log(props.validity.isValid.editName);
    //     console.log(props.validity.isValid.editDescription);
    //     if (
    //         props.validity.isValid.editName &&
    //         props.validity.isValid.editDescription
    //     ) {
    //         setvalidButton(true);
    //     } else {
    //         setvalidButton(false);
    //     }
    // }

    React.useEffect(() => {
        setName({
            ...inputName,
            editName: currentUser.name,
            editDescription: currentUser.about,
        });
    }, [currentUser]);

    React.useEffect(() => {
        document.addEventListener("keydown", props.handleEsc);

        return () => {
            document.removeEventListener("keydown", props.handleEsc);
        };
    }, []);

    const handleChange = (event) => {
        setName({ ...inputName, [event.target.name]: event.target.value });
        props.handleValidity(event.target);
        console.log(inputName);
    };

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateUser({
            name: inputName.editName,
            about: inputName.editDescription,
        });
    }

    return (
        <PopupWithForm
            validButton={props.validity.isValid}
            loader={props.loader}
            onSubmit={handleSubmit}
            title="Редактировать&nbsp;профиль"
            name="edit"
            isOpen={props.isOpen}
            onCloseAll={props.onClose}
            children={
                <>
                    <input
                        type="text"
                        value={inputName.editName || ""}
                        onChange={handleChange}
                        className="popup__field popup__field_type_name"
                        placeholder="Жак-Ив-Кусто"
                        name="editName"
                        id="name"
                        required
                        minLength="2"
                        maxLength="40"
                    />
                    <span className="error" id="name-error">
                        {props.validity.message.editName}
                    </span>
                    <input
                        type="text"
                        value={inputName.editDescription || ""}
                        onChange={handleChange}
                        className="popup__field popup__field_type_job"
                        name="editDescription"
                        placeholder="Исследователь океана"
                        id="profession"
                        required
                        minLength="2"
                        maxLength="200"
                    />
                    <span className="error" id="profession-error">
                        {props.validity.message.editDescription}
                    </span>
                </>
            }
        />
    );
}

export default EditProfilePopup;
