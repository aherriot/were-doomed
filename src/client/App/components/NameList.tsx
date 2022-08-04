const NameList = ({ children }: { children: string[] }) => {
  let content;
  if (children.length === 1) {
    content = children[0];
  } else if (children.length === 2) {
    content = children[0] + " and " + children[1];
  } else if (children.length > 2) {
    content =
      children.slice(0, -1).join(", ") +
      ", and " +
      children[children.length - 1];
  }

  return <span className="font-semibold">{content}</span>;
};

export default NameList;
