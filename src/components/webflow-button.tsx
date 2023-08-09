import { FunctionComponent } from "react";

interface WebflowButtonProps {
  onClick: () => void;
}

const WebflowButton: FunctionComponent<WebflowButtonProps> = ({ onClick }) => {
  return <div className="button-dark w-inline-block" onClick={onClick}></div>;
};

export default WebflowButton;
