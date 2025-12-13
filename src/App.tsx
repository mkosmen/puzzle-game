import { useEffect, useState } from "react";
import pImg from "./assets/images/image-1.jpg";
import { getNewSize, get1Part, getRow } from "./util";
import shuffle from "lodash.shuffle";

interface PartSize {
  width: number;
  height: number;
  // top: number;
  // left: number;
  bgPosX: number;
  bgPosy: number;
}

function PartItem(partSize: PartSize & { top: number; left: number }) {
  return (
    <div
      className="absolute top-0 left-0 bg-no-repeat"
      style={{
        width: `${partSize.width}px`,
        height: `${partSize.height}px`,
        top: `${partSize.top}px`,
        left: `${partSize.left}px`,
        backgroundImage: `url(${pImg})`,
        backgroundPositionX: partSize.bgPosX,
        backgroundPositionY: partSize.bgPosy,
      }}
    >
      <span className="absolute w-full h-full bg-transparent hover:bg-amber-900 transition-all opacity-25"></span>
    </div>
  );
}

function getRowCol(m: number) {
  const row = getRow(m) - 1;
  const col = m - row * 8;

  return [row, col];
}

function getTopLeft(m: number, pw: number, ph: number) {
  const [row, col] = getRowCol(m);
  const top = 1 * (row * ph);
  const left = 1 * (col * pw);

  return [top, left];
}

function App() {
  const [, setDimension] = useState({ width: 0, height: 0 });
  const [divSize, setDivSize] = useState({ width: 0, height: 0 });
  const [parts, setParts] = useState<PartSize[]>([]);
  const [partSize, setPartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = pImg;
    img.onload = () => {
      setDimension({ width: img.width, height: img.height });

      const [w, h] = getNewSize(img.width, img.height);
      setDivSize({ width: w, height: h });
      const [pw, ph, pt] = get1Part({ width: w, height: h });
      setPartSize({ width: pw, height: ph });

      const parts: PartSize[] = [...Array(pt)].map((_, i) => {
        const [top, left] = getTopLeft(i, pw, ph);
        const partSize = {
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
          Point: <span>0</span>
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
            // backgroundImage: `url(${pImg})`,
          }}
        >
          {parts.map((m, i) => {
            const [top, left] = getTopLeft(i, partSize.width, partSize.height);

            return <PartItem key={i} {...m} top={top} left={left} />;
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
