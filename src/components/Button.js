import React from "react";

const Button = ({ text, icon, variant, onClick }) => {
  return (
    <button
      className={`btn ${variant} d-flex align-items-center`}
      onClick={onClick}
    >
      {icon && <img src={icon} alt={text} className="me-2" />}
      {text}
    </button>
  );
};

export default Button;