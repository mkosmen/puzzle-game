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
  const widthSize = Math.round(width / colSize);
  const heightSize = Math.round(height / rowSize);

  return [widthSize, heightSize];
}

export function getRow(val: number, expo: number) {
  let row = 1;

  while (true) {
    if (val < row * expo) {
      break;
    }

    row += 1;
  }

  return row;
}

function getRowCol(m: number, expo: number) {
  const row = getRow(m, expo) - 1;
  const col = m - row * expo;

  return [row, col];
}

export function getTopLeft({
  m,
  pw,
  ph,
  expo,
}: {
  m: number;
  pw: number;
  ph: number;
  expo: number;
}) {
  const [row, col] = getRowCol(m, expo);
  const top = 1 * (row * ph);
  const left = 1 * (col * pw);

  return [top, left];
}

export function copy<T>(val: object, options?: StructuredSerializeOptions) {
  return structuredClone(val, options) as T;
}

export function getTimeOf(val: number) {
  const minute = Math.floor(val / 60);
  const second = val - minute * 60;

  return { second, minute };
}
