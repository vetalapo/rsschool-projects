const createLink: (link: string) => HTMLAnchorElement = (link: string): HTMLAnchorElement => {
  const a: HTMLAnchorElement = document.createElement('a');
  a.href = `${link}`;
  a.target = '_blank';
  return a;
};

export default createLink;
