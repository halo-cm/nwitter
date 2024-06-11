import { dbService, storageService } from "fbase";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilAlt,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Do you want to delete this tweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      if (nweetObj.attachmentURL !== "") {
        await storageService.refFromURL(nweetObj.attachmentURL).delete();
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({ text: newNweet });
    setEditing(false);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              onChange={onChange}
              value={newNweet}
              required
              placeholder="Edit your nweet"
              autoFocus
              className="formInput"
            />
            <input type="submit" value="update nweeet" className="formBtn" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            cancel
          </button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentURL && (
            <img
              src={nweetObj.attachmentURL}
              alt="twt"
              width="50px"
              height="50px"
            />
          )}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencil} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
