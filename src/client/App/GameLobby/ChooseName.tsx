import { useState } from "react";

const MAX_NAME_LENGTH = 10;
const MIN_NAME_LENGTH = 3;

type ChooseNameProps = {
  name: string | null;
  setName: (name: string) => void;
  setIsEditingName: (isEditingName: boolean) => void;
};

const ChooseName = ({ name, setName, setIsEditingName }: ChooseNameProps) => {
  const [nameValue, setNameValue] = useState<string>(name ?? "");
  const [showRestrictions, setShowRestrictions] = useState(false);

  const onEnter = () => {
    if (
      nameValue.length >= MIN_NAME_LENGTH &&
      nameValue.length <= MAX_NAME_LENGTH
    ) {
      localStorage.setItem("playerName", nameValue);
      setName(nameValue);
      setIsEditingName(false);
    } else {
      setShowRestrictions(true);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEnter();
  };

  const onCancel = () => {
    setIsEditingName(false);
  };

  return (
    <div>
      <p>Please enter your name:</p>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          maxLength={10}
        />
        <input type="submit" value="Submit" onClick={onEnter} />
        {nameValue.length === MAX_NAME_LENGTH && (
          <p>{MAX_NAME_LENGTH} is the max name length!</p>
        )}
        {showRestrictions && (
          <p>
            Names must be between {MIN_NAME_LENGTH} and {MAX_NAME_LENGTH}{" "}
            characters.
          </p>
        )}
      </form>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};
export default ChooseName;
