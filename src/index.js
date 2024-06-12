function component() {
  const element = document.createElement('div');

  element.innerHTML = 'Template Component';

  return element;
}

document.body.appendChild(component());