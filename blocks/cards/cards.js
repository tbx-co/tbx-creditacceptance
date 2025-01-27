import { createOptimizedPicture } from '../../scripts/aem.js';
import { createTag } from '../../libs/utils/utils.js';

export default function decorate(block) {
  // *** TODO: no checks if the block is null or not ***
  const isAnimated = block.classList.contains('animation');
  // creates unordered list
  const ul = createTag('ul');
  [...block.children].forEach((row) => {
    // creates list item for each row
    const li = createTag('li');
    // if parent is animated, add animation class to list item
    if (isAnimated) li.classList.add('animation-scale');
    /* creates card wrapper
    TODO: why create a cardWrapper if we later copy children
    from the row and decorate them? Why not just use the row
    as the card wrapper adding a class? */
    const cardWrapper = createTag('div', { class: 'card-wrapper' });
    // moves all children from row to cardWrapper
    while (row.firstElementChild) cardWrapper.append(row.firstElementChild);
    // empty heading
    let heading = null;
    // loop through all divs in cardWrapper
    [...cardWrapper.children].forEach((div) => {
      // if the only child in div is a picture
      if (div.children.length === 1 && div.querySelector('picture')) {
        // add cards-card-image class
        div.className = 'cards-card-image';
      } else {
        /* otherwise add cards-card-body class
        TODO: does it need to overwrite instead of adding? */
        div.className = 'cards-card-body';
        const h3 = div.querySelector('h3');
        if (h3) {
          // assigns <h3> element to heading variable
          heading = h3;
          // removes <h3> from div
          div.removeChild(h3);
        }
      }
      // locates an icon but only one
      const icon = div.querySelector('.icon img');
      if (icon) {
        // bubbles up two levels and replaces the icon with a div with a mask style
        const maskedDiv = createTag('div', {
          class: 'icon-masked',
          style: `mask:url(${icon.src}) no-repeat center`,
        });
        icon.parentNode.parentNode.replaceWith(maskedDiv);
      }
    });
    // sets heading
    if (heading) li.append(heading);
    // appends cardWrapper
    li.append(cardWrapper);
    // appends list item to unordered list
    ul.append(li);
  });
  // replaces all images with optimized versions
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  // empties the block and appends ul with decorated children
  block.textContent = '';
  block.append(ul);
}
