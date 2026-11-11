import { useState } from "react";
import "./FeedbackForm.css";

function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [wantsReply, setWantsReply] = useState(false);

  const [errors, setErrors] = useState({
    name: null,
    email: null,
    message: null,
    phone: null
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
    phone: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateName = (value) => {
    if (!value.trim()) return "Имя обязательно для заполнения";
    if (value.trim().length < 2) return "Минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value.trim())) {
      return "Только буквы, пробелы и дефис";
    }
    return null;
  };

  const validateEmail = (value, replyRequired = wantsReply) => {
    if (!replyRequired && !value.trim()) return null;
    if (!value.trim()) return "Email обязателен для заполнения";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return "Некорректный формат email";
    }
    return null;
  };

  const validateMessage = (value) => {
    if (!value.trim()) return "Сообщение обязательно для заполнения";
    if (value.trim().length < 10) return "Минимум 10 символов";
    if (value.length > 500) return "Максимум 500 символов";
    return null;
  };

  const validatePhone = (value) => {
    if (!value.trim()) return "Телефон обязателен для заполнения";
    if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value)) {
      return "Формат: +7 (XXX) XXX-XX-XX";
    }
    return null;
  };

  const validators = {
    name: validateName,
    email: validateEmail,
    message: validateMessage,
    phone: validatePhone
  };

  const formatPhone = (value) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "").replace(/^8/, "7").replace(/^7/, "");

    let result = "+7";

    if (digits.length > 0) {
      result += " (" + digits.slice(0, 3);
    }

    if (digits.length >= 3) {
      result += ")";
    }

    if (digits.length > 3) {
      result += " " + digits.slice(3, 6);
    }

    if (digits.length > 6) {
      result += "-" + digits.slice(6, 8);
    }

    if (digits.length > 8) {
      result += "-" + digits.slice(8, 10);
    }

    return result;
  };

  const handleChange = (field, value) => {
    let newValue = value;

    if (field === "name") {
      setName(value);
    }

    if (field === "email") {
      setEmail(value);
    }

    if (field === "message") {
      setMessage(value.slice(0, 500));
    }

    if (field === "phone") {
      newValue = formatPhone(value);
      setPhone(newValue);
    }

    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](newValue)
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true
    }));

    const currentValue =
      field === "name"
        ? name
        : field === "email"
        ? email
        : field === "message"
        ? message
        : phone;

    setErrors((prev) => ({
      ...prev,
      [field]: validators[field](currentValue)
    }));
  };

  const handleReplyChange = (value) => {
    setWantsReply(value);

    if (touched.email) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(email, value)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      message: validateMessage(message),
      phone: validatePhone(phone)
    };

    setErrors(newErrors);

    setTouched({
      name: true,
      email: true,
      message: true,
      phone: true
    });

    if (Object.values(newErrors).some((err) => err !== null)) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const getInputClass = (field) => {
    const classes = ["field__input"];

    if (touched[field] && errors[field]) {
      classes.push("field__input--error");
    } else if (touched[field] && !errors[field]) {
      classes.push("field__input--valid");
    }

    if (field === "message") {
      classes.push("field__input--textarea");
    }

    return classes.join(" ");
  };

  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success">
        <h2 className="feedback-form__title">Спасибо за обращение!</h2>
        <p className="feedback-form__text">
          Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          type="button"
          className="feedback-form__submit"
          onClick={() => {
            setName("");
            setEmail("");
            setMessage("");
            setPhone("");
            setWantsReply(false);
            setErrors({
              name: null,
              email: null,
              message: null,
              phone: null
            });
            setTouched({
              name: false,
              email: false,
              message: false,
              phone: false
            });
            setSubmitted(false);
          }}
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="name" className="field__label">
          Имя
        </label>
        <input
          id="name"
          type="text"
          className={getInputClass("name")}
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        {touched.name && errors.name && (
          <span className="field__error">{errors.name}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="phone" className="field__label">
          Телефон
        </label>
        <input
          id="phone"
          type="tel"
          className={getInputClass("phone")}
          value={phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          placeholder="+7 (XXX) XXX-XX-XX"
        />
        {touched.phone && errors.phone && (
          <span className="field__error">{errors.phone}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="email" className="field__label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={getInputClass("email")}
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
        />
        {touched.email && errors.email && (
          <span className="field__error">{errors.email}</span>
        )}
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={wantsReply}
          onChange={(e) => handleReplyChange(e.target.checked)}
        />
        <span>Хочу получить ответ</span>
      </label>

      <div className="field">
        <label htmlFor="message" className="field__label">
          Сообщение
        </label>
        <textarea
          id="message"
          className={getInputClass("message")}
          value={message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          rows={5}
          maxLength={500}
        />
        <div className="character-counter">
          {message.length} / 500
        </div>
        {touched.message && errors.message && (
          <span className="field__error">{errors.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="feedback-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Отправка…" : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;
