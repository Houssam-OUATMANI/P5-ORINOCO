// variables globales
const counter = document.querySelector('.counter')
const panierHolder = document.querySelector('.panier-item__holder')
const totalPriceHTML = document.querySelector(".price__holder")

// end variables globales

/**
 * 
 *  Fonctions Utilitaires localStorage
 */

function setTotalItem(){
    let totalItem = localStorage.getItem('totalItem')
    counter.innerHTML= totalItem
    return totalItem
}

function getCountItemCart(){
    let countItemCart = JSON.parse(localStorage.getItem('countItemCart'))
    return countItemCart
}

function setTotalPrice(){
    let totalPrice = localStorage.getItem('totalPrice')
    return totalPrice
}

async function getAllcart(){
    let paniers =  await JSON.parse(localStorage.getItem('paniers'))
    return paniers
}

function clearLocalSorage() {
    localStorage.removeItem('paniers')
     localStorage.removeItem('totalItem')
     localStorage.removeItem('totalPrice')
     localStorage.removeItem('cameras')
}



// END fonctions utilitaires


// injection HTML
function displayCart(paniers){
    paniers.map(arg => {
        panierHolder.innerHTML += `
        <article class="cart__article">
       
            <div class="flexbox">
                <div class="flexbox__image">
                <a href="./appareil.html?id=${arg._id}">
                    <img src=${arg.imageUrl} alt=${arg.description}>
                </a>
                </div>
                <div class="card__detail">
                    <h3> ${arg.name}</h3>
                    <p>PRIX : $ ${arg.price /100 * getCountItemCart()}</p>
                    <p></p>
                </div>
                <div>
                    <i class="fas fa-arrow-circle-left minus"></i>
                    <strong class="cart-counter"> 0 </strong>
                    <i class="fas fa-arrow-circle-right plus"></i>
                </div>
            </div>
        </article>
        `
        totalPriceHTML.innerHTML = `
        <p class="total-price">Prix :  ${setTotalPrice()} Euros</p>
        `
    })
}
// end Injection HTML



// augmenter la quantité
function addOne(){
    const cartCounter =[... document.querySelectorAll(".cart-counter")]
    const cartPlus = [...document.querySelectorAll(".plus")]
    
    cartPlus.forEach(arg => {
        arg.addEventListener('click', ()=> {
            cartCounter.map(arg => {
                if(arg.innerText === '9'){
                    arg.disabled = true
                }else{
                    arg.innerHTML = +arg.innerText +1
                    localStorage.setItem('countItemCart', JSON.stringify(+arg.innerText) )
                }
            })
        })
    })
}

// end augmenter la quantité

// diminuer la quantité
function minusOne(){
    const cartCounter =[... document.querySelectorAll(".cart-counter")]
    const cartMinus = [...document.querySelectorAll(".minus")]
    
    cartMinus.map(arg => {
        arg.addEventListener('click', ()=> {
            cartCounter.map(arg => {
                if(arg.innerText === '0'){
                    arg.disabled = true
                }else{
                    arg.innerHTML = +arg.innerText -1 
                }
            })
        })
    })
}

// end // diminuer la quantité


/***
 *
 *  FORMULAIRE
 *  
 ***/

const form = document.getElementById('form')
async function handleSubmit(){
    
    // variables locales form
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const address = document.getElementById('address').value
    const city = document.getElementById('city').value
    const email = document.getElementById('email').value
    //end variables locales form


    // VALIDATION EMAIL
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    const result = regex.test(email)
    if (!result) return alert('EMAIL NON VALIDE')
    // end VALIDATION EMAIL

    const panier  = JSON.parse(localStorage.getItem('paniers'))

    const data = {
        contact : {firstName, lastName, address, city, email},
        products : panier 
    }

    // post 
     const url = "http://127.0.0.1:3000/api/cameras/order"
     const response = await fetch(url, {
         method : 'POST',
         headers : {
             "content-type" : "application/json"
         },
         body : JSON.stringify(data)
     })
     const order  =await response.json()
     // end POST

     // stockage order pour l'afficher dans la page confirmation
     localStorage.setItem('order' , JSON.stringify(order))
     //
      clearLocalSorage()

    // redirection vers la page confirmation 
     window.location.href = "../../views/confirmation.html"
 }


 
document.addEventListener('DOMContentLoaded', ()=>{
    getAllcart().then(paniers => {
        displayCart(paniers)
        addOne()
        minusOne()
    })
    setTotalItem()
    
})
form.addEventListener('submit', (e)=>{
    e.preventDefault()
    handleSubmit()
    //formValidation()
})