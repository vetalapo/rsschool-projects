import createBtn from '../utilities/create-btn';
import createLink from '../utilities/create-link';
import { createIconSVG } from '../utilities/create-SVG';
import generateTitle from './title';

const createHeader: () => HTMLElement = (): HTMLElement => {
  const header: HTMLElement = document.createElement('header');
  header.classList.add('header');
  return header;
};

const createNav: () => HTMLElement = (): HTMLElement => {
  const nav: HTMLElement = document.createElement('nav');
  nav.classList.add('nav');
  return nav;
};

const createLogoContainer: () => HTMLDivElement = (): HTMLDivElement => {
  const logoContainer: HTMLDivElement = document.createElement('div');
  logoContainer.classList.add('logo-container');
  return logoContainer;
};

const generateHeader: () => HTMLElement = (): HTMLElement => {
  const header: HTMLElement = createHeader();
  const nav: HTMLElement = createNav();
  const logoContainer: HTMLDivElement = createLogoContainer();
  const linkGitHub: HTMLAnchorElement = createLink('https://github.com/vetalapo');
  const linkRsSchool: HTMLAnchorElement = createLink('https://rs.school/');

  logoContainer.append(linkGitHub, linkRsSchool);

  linkGitHub.append(createIconSVG('github', { width: `${60}px`, height: `${60}px` }, '#FFFFFF'));
  linkRsSchool.append(createIconSVG('logo-rs', { width: `${120}px`, height: `${60}px` }, '#000000'));

  nav.append(createBtn('to-garage', 'TO GARAGE'), createBtn('to-winners', 'TO WINNERS'));

  header.append(nav, generateTitle(), logoContainer);
  return header;
};

export default generateHeader;
