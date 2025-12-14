import { useEffect, useState } from "react";
import shuffle from "lodash.shuffle";

import { getNewSize, get1Part, getTopLeft, copy } from "./util";
import type { NullableNumber, PartSize } from "./types";

import pImg from "./assets/images/image-1.jpg";
import PartItem from "./components/PartItem";

const COL_SIZE = 8;
const ROW_SIZE = 4;

interface AvailableType {
  top: number[];
  right: number[];
  left: number[];
  bottom: number[];
}

const DEFAULT_TARGETS: AvailableType = {
  top: [],
  right: [],
  left: [],
  bottom: [],
};

const targetCache: Map<number, AvailableType> = new Map();

function App() {
  const [, setDimension] = useState({ width: 0, height: 0 });
  const [divSize, setDivSize] = useState({ width: 0, height: 0 });
  const [parts, setParts] = useState<PartSize[]>([]);
  const [partSize, setPartSize] = useState({ width: 0, height: 0 });
  const [sourceIndex, setSourceIndex] = useState<NullableNumber>(null);
  const [availables, setAvailables] = useState<AvailableType>(DEFAULT_TARGETS);
  const [move, setMove] = useState(0);
  const targetIndexes = [
    ...availables.top,
    ...availables.right,
    ...availables.bottom,
    ...availables.left,
  ];

  function setItem(index: number) {
    if (sourceIndex === null) {
      setSourceIndex(index);
      setTargets(index);
      return;
    }

    if (sourceIndex === index) {
      setSourceIndex(null);
      setAvailables(copy(DEFAULT_TARGETS));
      return;
    }

    const isTarget = isInTarget(index);
    if (isTarget) {
      const sourceItem = parts[sourceIndex];
      const targetItem = parts[index];

      const newParts = copy<PartSize[]>(parts);
      newParts[index] = sourceItem;
      newParts[sourceIndex] = targetItem;
      setParts(newParts);

      setMove((p) => p + 1);
    }

    setSourceIndex(null);
    setAvailables(copy(DEFAULT_TARGETS));
  }

  function setTargets(index: number) {
    const hasCache = targetCache.has(index);
    if (hasCache) {
      setAvailables(targetCache.get(index)!);
      return;
    }

    const max = COL_SIZE * ROW_SIZE;
    const topTargets =
      index - COL_SIZE < 0 ? [max - COL_SIZE] : [index - COL_SIZE];
    const rightTargets = index + 1 === max ? [0] : [index + 1];
    const bottomTargets =
      index + COL_SIZE > max ? [max - 1 + COL_SIZE - 1 - index] : [index + 8];
    const leftTargets = index - 1 < 0 ? [max - 1] : [index - 1];

    const availableTargets = {
      top: topTargets,
      right: rightTargets,
      bottom: bottomTargets,
      left: leftTargets,
    };
    setAvailables(availableTargets);

    targetCache.set(index, availableTargets);
  }

  function isInTarget(index: number): boolean {
    return targetIndexes.includes(index);
  }

  // ---

  useEffect(() => {
    const img = new Image();
    img.src = pImg;
    img.onload = () => {
      setDimension({ width: img.width, height: img.height });

      const [w, h] = getNewSize(img.width, img.height);
      setDivSize({ width: w, height: h });
      const [pw, ph] = get1Part({
        width: w,
        height: h,
        colSize: COL_SIZE,
        rowSize: ROW_SIZE,
      });
      setPartSize({ width: pw, height: ph });

      const parts: PartSize[] = [...Array(COL_SIZE * ROW_SIZE)].map((_, i) => {
        const [top, left] = getTopLeft(i, pw, ph);
        const partSize = {
          key: i,
          width: pw,
          height: ph,
          bgPosX: -1 * left,
          bgPosy: -1 * top,
        };

        return partSize;
      });

      const shuffledPart = shuffle(parts);

      setParts(shuffledPart);
    };
  }, []);

  return (
    <div className="flex h-screen flex-col md:max-w-5xl mx-auto">
      <header className="py-3 flex justify-between">
        <span>
          Moves: <span>{move}</span>
        </span>
        <span>
          Time: <span>00:00</span>
        </span>
      </header>
      <main className="flex-1 overflow-hidden relative">
        <div
          className="bg-red-200 bg-no-repeat bg-contain relative shadow rounded-md overflow-hidden"
          style={{
            width: `${divSize.width}px`,
            height: `${divSize.height}px`,
          }}
        >
          {parts.map((m, i) => {
            const [top, left] = getTopLeft(i, partSize.width, partSize.height);
            const isTarget = isInTarget(i);

            return (
              <PartItem
                {...m}
                key={m.key}
                top={top}
                left={left}
                pImg={pImg}
                selectedSource={sourceIndex !== null}
                isSource={sourceIndex === i}
                isTarget={isTarget}
                onClick={() => setItem(i)}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
