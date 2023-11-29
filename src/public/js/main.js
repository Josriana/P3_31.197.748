// Obtener los elementos relevantes del DOM
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const productList = document.getElementById('product-list');

// Agregar eventos de clic a los botones de vista 
gridViewBtn.addEventListener('click', function () {
  gridViewBtn.classList.add('active');
  listViewBtn.classList.remove('active');
  productList.classList.remove('list-view');
});

listViewBtn.addEventListener('click', function () {
  gridViewBtn.classList.remove('active');
  listViewBtn.classList.add('active');
  productList.classList.add('list-view');
});