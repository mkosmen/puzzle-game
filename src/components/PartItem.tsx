import classNames from "classnames";
import type { PartSize } from "../types";

type Props = PartSize & {
  top: number;
  left: number;
  pImg: string;
  isSource: boolean;
  selectedSource: boolean;
  onClick: () => void;
};

export default function PartItem(prop: Props) {
  return (
    <div
      className="absolute top-0 left-0 bg-no-repeat cursor-pointer"
      onClick={prop.onClick}
      style={{
        width: `${prop.width}px`,
        height: `${prop.height}px`,
        top: `${prop.top}px`,
        left: `${prop.left}px`,
        backgroundImage: `url(${prop.pImg})`,
        backgroundPositionX: prop.bgPosX,
        backgroundPositionY: prop.bgPosy,
      }}
    >
      <span
        className={classNames("absolute w-full h-full transition-all", {
          "bg-transparent hover:bg-amber-900 opacity-25": !prop.selectedSource,
          "opacity-65 border-3 border-red-800 cursor-move": prop.isSource,
          "bg-black opacity-60 hover:opacity-30 cursor-pointer":
            prop.selectedSource && !prop.isSource,
        })}
      ></span>
    </div>
  );
}
