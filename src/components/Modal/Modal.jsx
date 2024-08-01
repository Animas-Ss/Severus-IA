import { useState } from "react";
import "./Modal.css";
import { useDraggable } from "../../hooks/useDraggable";
import { IoCloseOutline } from "react-icons/io5";
import { BsSoundwave } from "react-icons/bs";

export const Modal = ({ res, handleDelete, asistent }) => {
  console.log(res);
  const { position, onMouseDown, onMouseUp, onMouseMove } = useDraggable();
  return (
    <>
      {res.length !== 0 ? (
        <div
          className="modal-container"
          style={{
            position: "absolute",
            left: position.x + "px",
            top: position.y + "px",
            cursor: "move",
            borderRadius: "15px",
          }}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          <header className="modal-head">
            <div className="modal-head-title">{res.prompt}</div>
            <div className="modal-btn-container">
              <button onClick={() => handleDelete(res.prompt)}><IoCloseOutline/></button>
              <button><BsSoundwave/></button>
            </div>
          </header>
          <div className="modal_content">{res.content}</div>
        </div>
      ) : null}
    </>
  );
};
