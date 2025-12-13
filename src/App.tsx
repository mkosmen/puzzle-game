import { useEffect, useState } from "react";
import pImg from "./assets/images/image-1.jpg";
import { getNewSize, get1Part, getRow } from "./util";

interface PartSize {
  width: number;
  height: number;
  top: number;
  left: number;
}

function PartItem(partSize: PartSize) {
  return (
    <div
      className="absolute top-0 left-0 bg-no-repeat"
      style={{
        width: `${partSize.width}px`,
        height: `${partSize.height}px`,
        top: `${partSize.top}px`,
        left: `${partSize.left}px`,
        backgroundImage: `url(${pImg})`,
        backgroundPositionX: -1 * partSize.left,
        backgroundPositionY: -1 * partSize.top,
      }}
    >
      <span className="absolute w-full h-full bg-transparent hover:bg-amber-900 transition-all opacity-25"></span>
    </div>
  );
}

function App() {
  const [, setDimension] = useState({ width: 0, height: 0 });
  const [divSize, setDivSize] = useState({ width: 0, height: 0 });
  const [parts, setParts] = useState<PartSize[]>([]);

  useEffect(() => {
    const img = new Image();
    img.src = pImg;
    img.onload = () => {
      setDimension({ width: img.width, height: img.height });

      const [w, h] = getNewSize(img.width, img.height);
      setDivSize({ width: w, height: h });
      const [pw, ph, pt] = get1Part({ width: w, height: h });

      const parts: PartSize[] = [...Array(pt)].map((_, m) => {
        const t = getRow(m) - 1;
        const l = m - t * 8;
        const partSize = {
          width: pw,
          height: ph,
          top: 1 * (t * ph),
          left: 1 * (l * pw),
        };

        return partSize;
      });

      setParts(parts);
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
            return <PartItem key={i} {...m} />;
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
