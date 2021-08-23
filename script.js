function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({
  sku,
  name,
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // 
}

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//  --------- requisito 1 

const getProductsAPI = async (product = 'computador') => {
  const productsJSON = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`);
  const productsObject = await productsJSON.json();
  return productsObject.results;
};

const addProducts = async () => {
  const newProducts = await getProductsAPI();
  newProducts.forEach((product) => {
    const newProduct = createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    });
    document.querySelector('.items').appendChild(newProduct);
  });
};

//  --------------- requisito 2 

const getProductAPI = async (event) => {
  const productID = getSkuFromProductItem(event.target.parentNode);
  const productJSON = await fetch(`https://api.mercadolibre.com/items/${productID}`);
  const product = await productJSON.json();
  const newItem = {
    sku: product.id,
    name: product.title,
    salePrice: product.price,
  };
  const newCartItem = createCartItemElement(newItem);
  document.querySelector('.cart__items').appendChild(newCartItem);
};

const buttonsCart = () => {
  const buttonsAdd = document.querySelectorAll('.item__add');
  buttonsAdd.forEach((button) => button.addEventListener('click', getProductAPI));
};

window.onload = async () => {
  await addProducts();
  buttonsCart();
};
