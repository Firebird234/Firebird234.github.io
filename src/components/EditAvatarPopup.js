import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
    const inputData = React.useRef({});

    const handleChange = (event) => {
        props.handleValidity(event.target);
    };

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateUser({
            avatar: inputData.current.value,
        });
        inputData.current.value = "";
    }

    React.useEffect(() => {
        document.addEventListener("keydown", props.handleEsc);

        return () => {
            document.removeEventListener("keydown", props.handleEsc);
        };
    }, []);

    return (
        <PopupWithForm
            validButton={props.validity.isValid}
            loader={props.loader}
            onSubmit={handleSubmit}
            title="Обновить&nbsp;аватар"
            name="card-removal"
            isOpen={props.isOpen}
            onCloseAll={props.onClose}
            children={
                <>
                    <input
                        onChange={handleChange}
                        ref={inputData}
                        type="url"
                        className="popup__field popup__field_type_link"
                        placeholder="Ссылка на аватар"
                        name="avaLink"
                        id="ava-link"
                        required
                    />
                    <span className="error" id="ava-link-error">
                        {props.validity.message.avaLink}
                    </span>
                </>
            }
        />
    );
}

export default EditAvatarPopup;
