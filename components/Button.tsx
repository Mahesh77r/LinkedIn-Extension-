import React from 'react'

interface ButtonProps {
    title: string;
    icon: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    style?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    textSize?: string;
  }
  
export const Button: React.FC<ButtonProps> = ({ title, icon, onClick, style, buttonStyle, textSize = '16px' }) => {
    return (
      <button
        style={{
          background: '#fff',
          color: '#666D80',
          padding: '8px 16px',
          border: '2px solid #666D80',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px',
          display: 'flex',
          alignItems: 'center',
          ...buttonStyle,
        }}
        onClick={onClick}
      >
        <img
          src={icon}
          alt={title}
          style={{
            verticalAlign: 'middle',
            marginRight: '5px',
            width: '14px',
            height: '14px',
            ...style,
          }}
        />
        <b style={{ fontSize: textSize }}>{title}</b>
      </button>
    );
  };
  