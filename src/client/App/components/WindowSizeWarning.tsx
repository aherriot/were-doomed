import useWindowSize from "./useWindowSize";

const MIN_WIDTH = 796;
const WindowSizeWarning = () => {
  const { width } = useWindowSize();
  if (width && width < MIN_WIDTH) {
    return (
      <div className="bg-yellow-200 text-sm rounded py-2 text-center my-2 max-w-lg mx-auto">
        This game requires a browser width of at least {MIN_WIDTH} pixels.
      </div>
    );
  }
  return null;
};
export default WindowSizeWarning;
