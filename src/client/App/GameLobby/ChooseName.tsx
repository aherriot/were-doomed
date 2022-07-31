import { useState } from "react";
import Button from "../components/Button";

const MAX_NAME_LENGTH = 8;
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
    <div className="text-center mt-10">
      <p>Please enter your player name:</p>
      <form className="mt-5" onSubmit={onSubmit}>
        <input
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500"
          type="text"
          placeholder="Player Name"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          maxLength={MAX_NAME_LENGTH}
        />
        <input
          className="ml-1 shadow bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="submit"
          value={name ? "Rename" : "Play"}
          onClick={onEnter}
        />
        {nameValue.length === MAX_NAME_LENGTH && (
          <p className="text-red-700 font-semibold">
            {MAX_NAME_LENGTH} is the max name length!
          </p>
        )}
        {showRestrictions && (
          <p className="text-red-700 font-semibold">
            Names must be between {MIN_NAME_LENGTH} and {MAX_NAME_LENGTH}{" "}
            characters.
          </p>
        )}
      </form>
      {name && (
        <Button className="mt-7" isPrimary={false} onClick={onCancel}>
          Go back to lobby
        </Button>
      )}
    </div>
  );
};
export default ChooseName;
