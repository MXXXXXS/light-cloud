import React, { useState, useEffect, useRef } from "react";

export default function Button(props) {
  return (
    <button {...props}>
      <style jsx>{`
        button:hover {
          --hover-color: gold;
          color: var(--hover-color);
          border: 2px var(--hover-color) dotted;
        }

        button {
          --color: ${props.color ? props.color : 'skyblue'};
          background: transparent;
          border-radius: 30%;
          color: var(--color);
          border: 2px var(--color) dotted;
          transition: color 1s cubic-bezier(0.165, 0.84, 0.44, 1),
            border 1s cubic-bezier(0.165, 0.84, 0.44, 1);
          outline: none;
          padding: 0;
        }

        /*选择器依据: public\icons\icofont.css
          根据https://icofont.com/how-to-use使用icon font
          原理: index.html引入了icofont.css
         */
        [class*=" icofont-"] {
          --font-size: ${props.fontSize ? props.fontSize : '2rem'};
          --button-height: calc(var(--font-size) * 2);
          font-size: var(--font-size);
          line-height: var(--button-height);
          height: var(--button-height);
          width: var(--button-height);
        }
      `}</style>
    </button>
  );
}
