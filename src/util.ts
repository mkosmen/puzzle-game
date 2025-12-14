export function getNewSize(width: number, height: number) {
  const widthRatio = 1024 / width;
  const newHeight = Math.ceil(height * widthRatio);

  return [1024, newHeight];
}

export function get1Part({
  width,
  height,
  colSize,
  rowSize,
}: {
  width: number;
  height: number;
  colSize: number;
  rowSize: number;
}) {
  const widthSize = Math.floor(width / colSize);
  const heightSize = Math.floor(height / rowSize);

  return [widthSize, heightSize];
}

export function getRow(val: number, expo = 8) {
  let row = 1;

  while (true) {
    if (val < row * expo) {
      break;
    }

    row += 1;
  }

  return row;
}

function getRowCol(m: number) {
  const row = getRow(m) - 1;
  const col = m - row * 8;

  return [row, col];
}

export function getTopLeft(m: number, pw: number, ph: number) {
  const [row, col] = getRowCol(m);
  const top = 1 * (row * ph);
  const left = 1 * (col * pw);

  return [top, left];
}

export function copy<T>(val: object, options?: StructuredSerializeOptions) {
  return structuredClone(val, options) as T;
}
