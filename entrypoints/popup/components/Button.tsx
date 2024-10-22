import React from 'react';
import '../App.css';

interface ButtonProps {
  title: string;
  icon: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  textColor?: string;
  bgColor?: string;
  textSize?: string;
}

export const Button: React.FC<ButtonProps> = ({ title, icon, onClick, bgColor, textColor, textSize = '16px' }) => {
  return (
    <button
      style={{ backgroundColor: bgColor, color: textColor, borderColor: title === "Insert" ? textColor : bgColor }}
      className={`border-2 border-solid py-2 px-4 rounded cursor-pointer mr-[10px] flex items-center`}
      onClick={onClick}
    >
      <img
        src={icon}
        alt={title}
        className='align-middle mr-[5px] w-[14px] h-[14px]'
      />
      <b style={{ fontSize: textSize }}>{title}</b>
    </button>
  );
};
