import classNames from "classnames";
import type { PartSize } from "../types";

type Props = PartSize & {
  top: number;
  left: number;
  pImg: string;
  isSource: boolean;
  isTarget: boolean;
  selectedSource: boolean;
  onClick: () => void;
};

export default function PartItem(prop: Props) {
  return (
    <div
      className={classNames("absolute top-0 left-0 bg-no-repeat", {
        "cursor-default": !prop.isSource,
        "cursor-pointer": prop.isSource || prop.isTarget,
      })}
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
        className={classNames("absolute w-full h-full", {
          "bg-transparent hover:bg-amber-900 transition-all opacity-25":
            !prop.selectedSource,
          "opacity-95": !prop.isTarget && prop.selectedSource,
          "opacity-65 border-3 border-indigo-700": prop.isTarget,
          "border-3 border-red-700": prop.isSource,
          "bg-gray-900": !prop.isSource,
        })}
      ></span>
    </div>
  );
}
