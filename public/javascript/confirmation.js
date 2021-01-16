const order = JSON.parse(localStorage.getItem('order'))
console.log(order.products.length) 
const {products} = order
const title = order.products.length == 1 ? 'VOTRE COMMANDE' : 'VOS COMMANDES'
const rendeOrder = document.querySelector('.render__order')


products.forEach(arg => {
    rendeOrder.innerHTML += `
        <article class="order__article">
           <h3>${arg.name}</h3>
           <p class=" id" >Identifiant du produit : ${arg._id}</p>
           <p class="price">prix du  produit : <span>$${arg.price / 100}</span></p>
        </article>`

})
