export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML('afterbegin', template);
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Failed to load template: ${path} (${res.status})`);
    }
    const template = await res.text();
    return template;
  } catch (error) {
    console.error('Template loading error:', error);
    return ''; // Return empty string on error
  }
}

export async function loadHeaderFooter() {
  try {
    const headerTemplate = await loadTemplate('/partials/header.html');
    const footerTemplate = await loadTemplate('/partials/footer.html');
    const headerElement = document.querySelector('#main-header');
    const footerElement = document.querySelector('#main-footer');

    if (headerElement && headerTemplate) {
      headerElement.innerHTML = '';
      renderWithTemplate(headerTemplate, headerElement);
    }

    if (footerElement && footerTemplate) {
      footerElement.innerHTML = '';
      renderWithTemplate(footerTemplate, footerElement);
    }
  } catch (error) {
    console.error('Error loading header/footer:', error);
  }
}

// INDIVIDUAL ACTIVITY: STRETCH GOAL
export function alertMessage(message, scroll = true) {
  // Create element
  const alert = document.createElement('div');
  alert.classList.add('alert');
  // Add message and 'X' button
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  // Add listener to remove alert when X is clicked
  alert.addEventListener('click', function (e) {
    if (e.target.tagName == 'SPAN') {
      main.removeChild(this);
    }
  });

  // Prepend to main
  const main = document.querySelector('main');
  main.prepend(alert);

  // Scroll to top if requested
  if (scroll) window.scrollTo(0, 0);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach((alert) => document.querySelector('main').removeChild(alert));
}
