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
  // link.dataset.index = index;
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
  const itemsRef = items.map((item, index) => {
    return createItemRef(item, index);
  });

  refs.gallery.append(...itemsRef);
}
window.onload = createGallery(galleryItems);

function onArrowClick(event) {
  let currentIndex = Number(refs.modalImage.dataset.index);

  if (event.code === 'ArrowLeft') {
    if (currentIndex > 0) {
      currentIndex -= 1;
      refs.modalImage.src = galleryItems[currentIndex].original;
      refs.modalImage.alt = galleryItems[currentIndex].description;
      refs.modalImage.dataset.index = currentIndex;
    }
  }

  if (currentIndex < galleryItems.length - 1) {
    if (event.code === 'ArrowRight') {
      currentIndex += 1;
      refs.modalImage.src = galleryItems[currentIndex].original;
      refs.modalImage.alt = galleryItems[currentIndex].description;
      refs.modalImage.dataset.index = currentIndex;
    }
  }
}

function onOpenModal() {
  window.addEventListener('keydown', onCloseEvent);
  window.addEventListener('keydown', onArrowClick);
  refs.modal.classList.add('is-open');
}

function onCloseModal() {
  refs.modalImage.src = '';
  refs.modalImage.alt = '';
  refs.modalImage.dataset.index = '';
  refs.modal.classList.remove('is-open');
  window.removeEventListener('keydown', onCloseEvent);
  window.removeEventListener('keydown', onArrowClick);
}

function onGalleryClick(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  const largeImageUrl = event.target.dataset.source;
  const currentIndex = Number(event.target.dataset.index);
  const imgDescription = event.target.alt;

  refs.modalImage.src = largeImageUrl;
  refs.modalImage.alt = imgDescription;
  refs.modalImage.dataset.index = currentIndex;
  onOpenModal();
}

const onCloseEvent = event => {
  if (event.target === refs.modalButton) {
    onCloseModal();
  }
  if (event.target === refs.overlayBox) {
    onCloseModal();
  }
  if (event.code === 'Escape') {
    onCloseModal();
  }
};

refs.gallery.addEventListener('click', onGalleryClick);
refs.modal.addEventListener('click', onCloseEvent);
