import React from "react";

const Button = ({ children, btnType, extraClasses = '', onClickHandler, ...props }) => {
  const type = {
    primary: "bg-white text-gray-900",
  };
  return (
    <button className={`rounded ${type[btnType]} `.concat(extraClasses)} onClick={onClickHandler}>
      {children}
    </button>
  );
};

export default Button;
