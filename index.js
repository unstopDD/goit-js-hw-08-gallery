'use strict';

import galleryItems from './gallery-items.js';

const refs = {
  gallery: document.querySelector('.js-gallery'),
  modal: document.querySelector('.js-lightbox'),
  modalImage: document.querySelector('.lightbox__image'),
  modalButton: document.querySelector('button[data-action="close-lightbox"]'),
  overlayBox: document.querySelector('.lightbox__content'),
};

function createItemRef(galleryItem, index) {
  const item = document.createElement('li');
  item.classList.add('gallery__item');
  const link = document.createElement('a');
  link.classList.add('gallery__link');
  link.href = galleryItem.original;
  const img = document.createElement('img');
  img.classList.add('gallery__image');
  img.src = galleryItem.preview;
  img.dataset.source = galleryItem.original;
  img.dataset.index = index;
  img.alt = galleryItem.description;
  link.appendChild(img);
  item.appendChild(link);
  return item;
}

function createGallery(items) {
  const itemsRef = [];
  let index = 0;
  items.map(item => {
    itemsRef.push(createItemRef(item, index));
    index += 1;
    return itemsRef;
  });
  refs.gallery.append(...itemsRef);
}
window.onload = createGallery(galleryItems);

function onOpenModal() {
  window.addEventListener('keydown', event => {
    if (event.code === 'Escape') {
      onCloseModal();
    }
  });

  refs.modal.classList.add('is-open');
}

function onCloseModal() {
  refs.modalImage.src = '';
  refs.modalImage.alt = '';
  refs.modalImage.dataset.index = '';
  refs.modal.classList.remove('is-open');
}

function onGalleryClick(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  const largeImageUrl = event.target.dataset.source;
  let currentIndex = Number(event.target.dataset.index);
  const imgDescription = event.target.alt;
  onOpenModal();

  refs.modalImage.src = largeImageUrl;
  refs.modalImage.alt = imgDescription;
  refs.modalImage.dataset.index = currentIndex;

  window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') {
      if (currentIndex >= 0) {
        currentIndex -= 1;
        for (let i = 0; i < galleryItems.length; i += 1) {
          if (i === currentIndex) {
            refs.modalImage.src = galleryItems[i].original;
            refs.modalImage.alt = galleryItems[i].description;
            refs.modalImage.dataset.index = currentIndex;
          }
        }
      }
    }
  });
  window.addEventListener('keydown', e => {
    if (currentIndex <= galleryItems.length) {
      if (e.code === 'ArrowRight') {
        currentIndex += 1;
        for (let i = 0; i < galleryItems.length; i += 1) {
          if (i === currentIndex) {
            refs.modalImage.src = galleryItems[i].original;
            refs.modalImage.alt = galleryItems[i].description;
            refs.modalImage.dataset.index = currentIndex;
          }
        }
      }
    }
  });
}

function onModalClick(event) {
  if (event.target === event.currentTarget) {
    onCloseModal();
  }
}

refs.gallery.addEventListener('click', onGalleryClick);
refs.modalButton.addEventListener('click', onCloseModal);
refs.overlayBox.addEventListener('click', onModalClick);
