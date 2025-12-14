import { useEffect, useRef, useState } from "react";
import shuffle from "lodash.shuffle";

import { getNewSize, get1Part, getTopLeft, copy, getTimeOf } from "./util";
import type { NullableNumber, PartSize } from "./types";

import pImg from "./assets/images/image-1.jpg";
import PartItem from "./components/PartItem";

const COL_SIZE = 8;
const ROW_SIZE = 6;

function App() {
  const [, setDimension] = useState({ width: 0, height: 0 });
  const [divSize, setDivSize] = useState({ width: 0, height: 0 });
  const [parts, setParts] = useState<PartSize[]>([]);
  const [partSize, setPartSize] = useState({ width: 0, height: 0 });
  const [sourceIndex, setSourceIndex] = useState<NullableNumber>(null);
  const [move, setMove] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const timer = useRef(0);
  const [timeStr, setTimeStr] = useState("00:00");
  let time = 0;

  function setItem(index: number) {
    if (sourceIndex === null) {
      setSourceIndex(index);
      return;
    }

    if (sourceIndex === index) {
      setSourceIndex(null);
      return;
    }

    setMove((p) => p + 1);
    const sourceItem = parts[sourceIndex];
    const targetItem = parts[index];

    const newParts = copy<PartSize[]>(parts);
    newParts[index] = sourceItem;
    newParts[sourceIndex] = targetItem;
    setParts(newParts);
    setSourceIndex(null);
  }

  function setReadyState() {
    timer.current = setInterval(() => {
      time++;
      const { minute, second } = getTimeOf(time);
      setTimeStr(
        `${minute.toString().padStart(2, "0")}:${second
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);
    setIsReady(true);
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
        const [top, left] = getTopLeft({ m: i, pw, ph, expo: COL_SIZE });
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

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  return (
    <div className="flex h-screen flex-col md:max-w-5xl mx-auto">
      <header className="py-3 flex justify-between">
        <span>
          Moves: <span>{move}</span>
        </span>
        <span>
          Time: <span>{timeStr}</span>
        </span>
      </header>
      <main className="flex-1 overflow-hidden relative flex flex-col gap-2">
        <div
          className="bg-red-200 bg-no-repeat bg-contain relative shadow rounded-md overflow-hidden"
          style={{
            width: `${divSize.width}px`,
            height: `${divSize.height}px`,
            backgroundImage: !isReady ? `url(${pImg})` : undefined,
          }}
        >
          {isReady &&
            parts.map((m, i) => {
              const [top, left] = getTopLeft({
                m: i,
                pw: partSize.width,
                ph: partSize.height,
                expo: COL_SIZE,
              });

              return (
                <PartItem
                  {...m}
                  key={m.key}
                  top={top}
                  left={left}
                  pImg={pImg}
                  selectedSource={sourceIndex !== null}
                  isSource={sourceIndex === i}
                  onClick={() => setItem(i)}
                />
              );
            })}
        </div>

        {!isReady && (
          <div className="text-center">
            <button
              onClick={setReadyState}
              className="p-3 bg-purple-700 text-white text-center md:max-w-40 w-full rounded"
            >
              I'm Ready
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
