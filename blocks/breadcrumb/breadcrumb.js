import { createElement } from '../../scripts/scripts.js';

const getPageTitle = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    return html.querySelector('title').innerText;
  }

  return '';
};

const getAllPathsExceptCurrent = async (paths) => {
  const result = [];
  // remove first and last slash characters
  const pathsList = paths.replace(/^\/|\/$/g, '').split('/');
  for (let i = 0; i < pathsList.length - 1; i += 1) {
    const pathPart = pathsList[i];
    const prevPath = result[i - 1] ? result[i - 1].path : '';
    const path = `${prevPath}/${pathPart}`;
    const url = `${window.location.origin}${path}`;
    /* eslint-disable-next-line no-await-in-loop */
    const name = await getPageTitle(url);
    if (name) {
      result.push({ path, name, url });
    }
  }
  return result;
};

const createLink = (path) => {
  const pathLink = document.createElement('a');
  pathLink.href = path.url;
  pathLink.innerText = path.name;
  return pathLink;
};

export default async function decorate(block) {
  const breadcrumb = createElement('nav', '', {
    'aria-label': 'Breadcrumb',
  });
  block.innerHTML = '';
  
  // Get configuration from Universal Editor model
  const separator = block.dataset.separator || '/';
  const showHome = block.dataset.showHome !== 'false';
  
  // Check if we're in Universal Editor context
  const isEditor = document.body.classList.contains('editor') || window.location.search.includes('editor');
  
  if (isEditor) {
    // Show placeholder content in editor with custom separator
    const homeLink = showHome ? `<a href="/">Home</a><span class="breadcrumb-separator">${separator}</span>` : '';
    breadcrumb.innerHTML = `
      ${homeLink}
      <a href="/products">Products</a>
      <span class="breadcrumb-separator">${separator}</span>
      <span>Current Page</span>
    `;
    block.append(breadcrumb);
    return;
  }
  
  const HomeLink = createLink({ path: '', name: 'Home', url: window.location.origin });
  const breadcrumbLinks = [HomeLink.outerHTML];

  window.setTimeout(async () => {
    const path = window.location.pathname;
    const paths = await getAllPathsExceptCurrent(path);

    paths.forEach((pathPart) => breadcrumbLinks.push(createLink(pathPart).outerHTML));
    const currentPath = document.createElement('span');
    const pageTitle = document.querySelector('title');
    currentPath.innerText = pageTitle ? pageTitle.innerText : 'Current Page';
    breadcrumbLinks.push(currentPath.outerHTML);

    breadcrumb.innerHTML = breadcrumbLinks.join(`<span class="breadcrumb-separator">${separator}</span>`);
    block.append(breadcrumb);
  }, 1000);
}
