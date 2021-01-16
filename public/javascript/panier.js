const counter = document.querySelector('.counter')
const panierHolder = document.querySelector('.panier-item__holder')
const totalPriceHTML = document.querySelector(".price__holder")



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

function displayCart(paniers){
    paniers.map(arg => {
        panierHolder.innerHTML += `
        <article class="cart__article">
        <h3>${arg.name}</h3>
        <p>$ ${arg.price /100 * 5}</p>
            <div class="flexbox">
                <div class="flexbox__image">
                <a href="./appareil.html?id=${arg._id}">
                    <img src=${arg.imageUrl} alt=${arg.description}>
                </a>
                </div>
                <div>
                    <span class="minus">&larr;</span>
                    <strong class="cart-counter">0</strong>
                    <span class="plus">&rarr;</span>
                </div>
            </div>
        </article>
        `
        totalPriceHTML.innerHTML = `
        <p>Prix :  ${setTotalPrice()} Euros</p>
        `
    })
}

function addOne(){
    const cartCounter =[... document.querySelectorAll(".cart-counter")]
    const cartPlus = [...document.querySelectorAll(".plus")]
    
    cartPlus.map(arg => {
        arg.addEventListener('click', ()=> {
            cartCounter.map(arg => {
                if(arg.innerText === '9'){
                    arg.disabled = true
                }else{
                    arg.innerHTML = +arg.innerText +1 
                }
            })
        })
    })
}


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


function clearLocalSorage() {
    localStorage.removeItem('paniers')
     localStorage.removeItem('totalItem')
     localStorage.removeItem('totalPrice')
     localStorage.removeItem('cameras')
}


/***
 * 
 *  FORMULAAIRE
 */


const form = document.getElementById('form')
async function handleSubmit(){
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const address = document.getElementById('address').value
    const city = document.getElementById('city').value
    const email = document.getElementById('firstName').value
    const panier  = JSON.parse(localStorage.getItem('paniers'))

    const data = {
        contact : {firstName, lastName, address, city, email},
        products : panier 
    }

     const url = "http://127.0.0.1:3000/api/cameras/order"
     const response = await fetch(url, {
         method : 'POST',
         headers : {
             "content-type" : "application/json"
         },
         body : JSON.stringify(data)
     })
     const order  =await response.json()
     localStorage.setItem('order' , JSON.stringify(order))
     clearLocalSorage()
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
})