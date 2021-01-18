const counter = document.querySelector('.counter')
const panierHolder = document.querySelector('.panier-item__holder')
const totalPriceHTML = document.querySelector(".price__holder")



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
                <div>
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