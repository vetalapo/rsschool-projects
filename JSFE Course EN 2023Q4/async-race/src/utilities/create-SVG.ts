import { Car, Color, SVGSizes } from '../types/types';

export const createCarSVG: (value: Car, sizes: SVGSizes) => SVGSVGElement = (
  value: Car,
  sizes: SVGSizes
): SVGSVGElement => {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const XLINK_NS = 'http://www.w3.org/1999/xlink';
  const iconType: number = value.id % 4;
  const { width, height } = sizes;

  const svg: SVGSVGElement = document.createElementNS(SVG_NS, 'svg');
  svg.id = `car-${value.id}`;
  svg.style.fill = `${value.color}`;
  svg.style.width = width;
  svg.style.height = height;
  svg.style.zIndex = '5';

  const use: SVGUseElement = document.createElementNS(SVG_NS, 'use');
  use.setAttributeNS(XLINK_NS, 'href', `./assets/sprite.svg#car-${iconType}`);

  svg.append(use);
  return svg;
};

export const createIconSVG: (name: string, sizes: SVGSizes, color: Color) => SVGSVGElement = (
  name: string,
  sizes: SVGSizes,
  color: Color
): SVGSVGElement => {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const XLINK_NS = 'http://www.w3.org/1999/xlink';
  const { width, height } = sizes;

  const svg: SVGSVGElement = document.createElementNS(SVG_NS, 'svg');
  svg.id = `${name}`;
  svg.classList.add(`${name}`);
  svg.style.fill = `${color}`;
  svg.style.width = width;
  svg.style.height = height;
  svg.style.zIndex = '1';

  const use: SVGUseElement = document.createElementNS(SVG_NS, 'use');
  use.setAttributeNS(XLINK_NS, 'href', `./assets/${name}.svg#${name}`);

  svg.append(use);
  return svg;
};
