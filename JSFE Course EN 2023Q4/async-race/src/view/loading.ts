const createLoadingContainer: () => HTMLDivElement = (): HTMLDivElement => {
  const loadingContainer: HTMLDivElement = document.createElement('div');

  loadingContainer.innerHTML = `<div class="wrapper" id="loading">
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="shadow"></div>
  <div class="shadow"></div>
  <div class="shadow"></div>
  <span>Loading</span>
</div>`;

  return loadingContainer;
};

export const turnOnLoadingAnimation: () => void = (): void => {
  const body: HTMLElement | null = document.getElementById('body');
  body?.append(createLoadingContainer());
};

export const turnOffLoadingAnimation: () => void = (): void => {
  const loadingContainer: HTMLElement | null = document.getElementById('loading');
  loadingContainer?.remove();
};
