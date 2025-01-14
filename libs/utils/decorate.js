// Shared block decorate functions

export function decorateButtons(el) {
  const buttons = el.querySelectorAll('em a, strong a, p > a strong');
  if (buttons.length === 0) return;
  const buttonTypeMap = { STRONG: 'primary', EM: 'secondary', A: 'link' };
  buttons.forEach((button) => {
    let target = button;
    const parent = button.parentElement;
    const buttonType = buttonTypeMap[parent.nodeName] || 'outline';
    if (button.nodeName === 'STRONG') {
      target = parent;
    } else {
      parent.insertAdjacentElement('afterend', button);
      parent.remove();
    }
    target.classList.add('button', buttonType);
    const customClasses = target.href && [...target.href.matchAll(/#_button-([a-zA-Z-]+)/g)];
    if (customClasses) {
      customClasses.forEach((match) => {
        target.href = target.href.replace(match[0], '');
        if (target.dataset.modalHash) {
          target.setAttribute('data-modal-hash', target.dataset.modalHash.replace(match[0], ''));
        }
        target.classList.add(match[1]);
      });
    }
  });
}

export function handleFocalpoint(pic, child, removeChild) {
  const image = pic.querySelector('img');
  if (!child || !image) return;
  let text = '';
  if (child.childElementCount === 2) {
    const dataElement = child.querySelectorAll('p')[1];
    text = dataElement?.textContent;
    if (removeChild) dataElement?.remove();
  } else if (child.textContent) {
    text = child.textContent;
    const childData = child.childNodes;
    if (removeChild) childData.forEach((c) => c.nodeType === Node.TEXT_NODE && c.remove());
  }
  if (!text) return;
  const directions = text.trim().toLowerCase().split(',');
  const [x, y = ''] = directions;
  image.style.objectPosition = `${x} ${y}`;
}

export async function decorateBlockBg(block, node, { useHandleFocalpoint = false, className = 'background' } = {}) {
  const childCount = node.childElementCount;
  if (node.querySelector('img, video') || childCount > 1) {
    node.classList.add(className);
    const twoVP = [['mobile-only'], ['tablet-only', 'desktop-only']];
    const threeVP = [['mobile-only'], ['tablet-only'], ['desktop-only']];
    const viewports = childCount === 2 ? twoVP : threeVP;
    [...node.children].forEach((child, i) => {
      if (childCount > 1) child.classList.add(...viewports[i]);
      const pic = child.querySelector('picture');
      if (useHandleFocalpoint && pic
        && (child.childElementCount === 2 || child.textContent?.trim())) {
        handleFocalpoint(pic, child, true);
      }
    });
  } else {
    block.style.background = node.textContent;
    node.remove();
  }
}
