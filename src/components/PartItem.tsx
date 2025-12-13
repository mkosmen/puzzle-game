import type { PartSize } from "../types";

type Props = PartSize & { top: number; left: number; pImg: string };

export default function PartItem(prop: Props) {
  return (
    <div
      className="absolute top-0 left-0 bg-no-repeat"
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
      <span className="absolute w-full h-full bg-transparent hover:bg-amber-900 transition-all opacity-25"></span>
    </div>
  );
}
