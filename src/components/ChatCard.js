import React from "react";
import { useState } from "react";
import { Modal, Alert } from "antd";

function ChatCard({
  index,
  handleSelectDocument,
  selectedDocumentIndex,
  handleDeleteDocument,
  document, 
}) {
  const [isDocumentHovered, setIsDocumentHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDocumentHovered(true);
  };

  const handleMouseLeave = () => {
    setIsDocumentHovered(false);
  };

  async function handleConfirmDelete() {
    await handleDeleteDocument(index, document);
    setModalOpen(false);
  }

  if (document)
    return (
      <>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          key={index}
          className={
            selectedDocumentIndex == document.document_id
              ? "cursor-pointer z-50 flex items-center justify-between bg-stone-200 rounded-xl text-sm py-1 pr-3"
              : "cursor-pointer z-50 flex items-center justify-between hover:bg-stone-100 rounded-xl text-sm py-1 pr-3"
          }
          id={`card-${document.document_id}`}
        >
          <Modal
            centered
            open={modalOpen}
            onOk={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
            footer={true}
          >
            <div>
              <span className="font-semibold text-lg">
                Are you sure you want to delete this document?
              </span>
            </div>
            <div>
              <p>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </p>
            </div>
            <div className="pt-5 flex items-center justify-end">
              <button
                className="px-5 py-2 rounded-md border hover:bg-stone-50 text-red-500 border-red-500"
                onClick={() => handleConfirmDelete()}
              >
                Delete
              </button>
            </div>
          </Modal>
          <div
            className={`space-x-2 w-3/4 truncate line-height-1 py-1 px-3 rounded-md cursor-pointer  flex items-center justify-between`}
            onClick={() => handleSelectDocument(document.document_id)}
          >
            <div className="flex items-center space-x-2 truncate">
              <img
                src="/img/Document.svg"
                className="h-4 w-4"
                alt="Document Icon"
              />
              <span className="text-sm truncate">
                {document && document.document_name}
              </span>
            </div>
          </div>
          {isDocumentHovered && (
            <img
              className="cursor-pointer rounded-md text-sm z-50 flex justify-center text-center hover:bg-stone-300 p-1"
              onClick={() => setModalOpen(true)}
              src="/img/trash.svg"
            />
          )}
        </div>
      </>
    );
}

export default ChatCard;
