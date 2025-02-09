const createTitle = () => {
  const title: HTMLDivElement = document.createElement('div');
  title.classList.add('title');
  return title;
};

const generateChar: (value: string) => HTMLSpanElement = (value: string): HTMLSpanElement => {
  const char: HTMLSpanElement = document.createElement('span');
  char.innerText = value;
  return char;
};

const generateTitle = () => {
  const title: HTMLDivElement = createTitle();
  const A1: HTMLSpanElement = generateChar('A');
  const S: HTMLSpanElement = generateChar('S');
  const Y: HTMLSpanElement = generateChar('Y');
  const N: HTMLSpanElement = generateChar('N');
  const C1: HTMLSpanElement = generateChar('C');
  const R: HTMLSpanElement = generateChar('R');
  const A2: HTMLSpanElement = generateChar('A');
  const C2: HTMLSpanElement = generateChar('C');
  const E: HTMLSpanElement = generateChar('E');
  title.append(A1, S, Y, N, C1, R, A2, C2, E);
  return title;
};

export default generateTitle;
