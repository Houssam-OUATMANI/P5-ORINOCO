// variables globales
const counter = document.querySelector('.counter')
const panierHolder = document.querySelector('.panier-item__holder')
const totalPriceHTML = document.querySelector(".price__holder")
const btnSubmit = document.querySelector('.btn-submit')
const deleteHolder = document.querySelector('.delete__holder')
const outerLoader= document.querySelector('.loader__outer')




// end variables globales

/**
 * 
 *  Fonctions Utilitaires localStorage
 */

outerLoader.style.visibility = "visible"

function setTotalItem(){
    let totalItem = localStorage.getItem('totalItem')
    counter.innerHTML= totalItem
    return totalItem
}

function setTotalPrice(){
    let totalPrice = localStorage.getItem('totalPrice')
    return totalPrice
}

async function getAllcart(){
    let paniers =  await JSON.parse(localStorage.getItem('paniers'))
    return paniers
}

function clearLocalStorage() {
     localStorage.removeItem('paniers')
     localStorage.removeItem('totalItem')
     localStorage.removeItem('totalPrice')
     localStorage.removeItem('cameras')
}



// END fonctions utilitaires


// injection HTML
function displayCart(paniers){
    if(paniers !== null ){
        outerLoader.style.display = "none"
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
                        <p class="card__detail-price">PRIX : $ ${arg.price /100}</p>

                    </div>
                    <span class="trash__holder" title="Supprimer l'article" data-id="${arg._id}">
                        <i class="fas fa-trash-alt"></i>
                    </span>

                </div>
            </article>
            `
            deleteHolder.innerHTML = `<button class="delete-all-btn">Effacer le panier</button>`
            totalPriceHTML.innerHTML = `
            <p class="total-price">Prix :  ${setTotalPrice()} Euros</p>
            `
        })
    }
    if (paniers.length <= 0) {
        panierHolder.innerHTML = "<h2 style='text-align:center;'>VOtre panier est vide !</h2>"
        deleteHolder.innerHTML = ""
    }
}


// end Injection HTML

// delete one article
function deleteOne(){
    let priceToRemove
    let getPanier = JSON.parse(localStorage.getItem('paniers'))
    let getTotalItems = JSON.parse(localStorage.getItem('totalItem'))

    const deleteIcons = [...document.querySelectorAll('.trash__holder')]

    deleteIcons.map(arg =>{
        arg.addEventListener('click', ({target})=> {
            // retirer l'article html
             target.parentElement.parentElement.parentElement.remove()
             // soustraire le prix
            priceToRemove = getPanier.find(article => article._id === arg.dataset.id )
            let totalPrice = JSON.parse(localStorage.getItem('totalPrice'))
            totalPrice -= priceToRemove.price /100 
            localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
            totalPriceHTML.innerHTML = `<p class="total-price">PRIX : ${totalPrice}</p>`

             getPanier = getPanier.filter(article =>article._id !== arg.dataset.id )
             localStorage.setItem('paniers', JSON.stringify(getPanier))
             getTotalItems = getPanier.length
             localStorage.setItem('totalItem', JSON.stringify(getTotalItems))
             counter.innerHTML = getTotalItems

             if (getTotalItems === 0){
                 deleteHolder.remove()
                 totalPriceHTML.remove()
                 panierHolder.innerHTML = "<h2>VOTRE PANIER EST VIDE !</h2>"
                 panierHolder.style.textAlign = "center" 
                 btnSubmit.disabled = true
                 btnSubmit.style.cursor = "not-allowed"
                 clearLocalStorage()
             }
        })
    })
}

// delete all articles

function deleteAll(){
    const deleteAllBtn = document.querySelector('.delete-all-btn')
    if(deleteAllBtn !== null){
        deleteAllBtn.addEventListener('click', ()=> {
            const conf = confirm('Etes-vous sur de vouloir effacer tout le panier')
            if (conf){
               clearLocalStorage()
               panierHolder.innerHTML = "<h2 style='text-align = 'center''>VOTRE PANIER EST VIDE ! </h2>"
               totalPriceHTML.innerHTML = 'Redirection dans ...'
               deleteHolder.remove()
               function redirect(){
                  return window.location.href ="../../views/produits.html"
               }
               setTimeout(redirect , 1500)
            }
        })
    }
}

/***
 *
 *  FORMULAIRE
 *  
 ***/

const form = document.getElementById('form')
const getTotalItems = localStorage.getItem('totalItem')
if(getTotalItems === 0 || getTotalItems === undefined || getTotalItems === null){
    btnSubmit.disabled = true
    btnSubmit.style.cursor = "not-allowed"
}
async function handleSubmit(){
    // variables locales form
    const firstName = document.getElementById('firstName')
    const lastName = document.getElementById('lastName')
    const address = document.getElementById('address')
    const city = document.getElementById('city')
    const email = document.getElementById('email')
    //end variables locales form


    // VALIDATION EMAIL
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    const alplhaNumeric = /^[\w_-\s]*$/

    const resultEmail = emailRegex.test(email.value)
    const resultFirstName = alplhaNumeric.test(firstName.value)
    const resultLastName  =alplhaNumeric.test(lastName.value)
    const resultAddress  =alplhaNumeric.test(address.value)
    const resultCity  =alplhaNumeric.test(city.value)

    if (!resultFirstName){
        return alert(" Prénom non valide !")
    }else if (!resultLastName){
        return alert(" Nom de famille non valide ! ")
    }
    else if (!resultAddress){
        return alert(" Adresse non valide ! ")
    }
    else if (!resultCity){
        return alert(" Ville non valide ! ")
    }
    else if (!resultEmail) {
        return alert("Email non Valide !")
    }
    // end VALIDATION EMAIL


    const panier  = JSON.parse(localStorage.getItem('paniers'))
    const data = {
        contact : {
                firstName : firstName.value,
                lastName : lastName.value,
                address : address.value,
                city : city.value,
                email : email.value
            },
        products : panier,
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
      clearLocalStorage()
    // redirection vers la page confirmation 
     window.location.href = "../../views/confirmation.html"
 }

document.addEventListener('DOMContentLoaded', ()=>{
    getAllcart().then(paniers => {
        displayCart(paniers)
        deleteAll(paniers)
        deleteOne()
    })
    setTotalItem()
    
})
form.addEventListener('submit', (e)=>{
    e.preventDefault()
    handleSubmit()
})