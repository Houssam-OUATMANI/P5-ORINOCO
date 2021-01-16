const cardHolder = document.querySelector('.card__holder')
const counter = document.querySelector('.counter')
let panier = []


async function fetchData(){
    try{
        const url = "http://localhost:3000/api/cameras"
        const getData = await fetch(url)
        const response = await getData.json()
        
        return response
    }
    catch(err){
        throw new Error(`Well something wrong happend\n ${err}`)
    }
}
const  display = (cameras) =>{
    cameras.map(arg => {
        cardHolder.innerHTML += `
        <article class="card">
        <a href="./appareil.html?id=${arg._id}">
            <div class="card__img">
                <img src="${arg.imageUrl}" alt="${arg.name}">
            </div>
        </a>
            <div class="card__info">
                    <h3>${arg.name}</h3>
                <p>Prix <strong>${arg.price / 100} $</strong></p>
            </div>
            <button class="panier-btn" data-id="${arg._id}">Ajouter au panier</button>
            <a class="detail" href="./appareil.html?id=${arg._id}">Details</a>
        </article>
        `
    })
}

// Ajouter au panier buttons
function getButtons(){
    const addButtons = [...document.querySelectorAll('.panier-btn')]
        addButtons.map(addButton => {
            const _id = addButton.dataset.id
            const getPaniers = JSON.parse(localStorage.getItem('paniers'))
            const clickedOne = getPaniers.find(arg => arg._id === _id) 
            if(clickedOne){
                addButton.innerHTML = "Ajouté au panier !"
                addButton.disabled = true
                addButton.classList.add('disabled')
            }else{
                addButton.addEventListener('click', ()=>{ 
                    addButton.innerHTML = "Ajouté au panier" 
                    addButton.disabled = true
                    addButton.classList.add('disabled')
                   // Strorage.setIsDisabled(true ,_id)
                    const targetItem = {...Strorage.getproducts(_id), count : 1 , added :true}
                    console.log(targetItem)
                    panier = [...JSON.parse(localStorage.getItem('paniers')), targetItem]
                    Strorage.saveCart(panier)
                    setItemValues(panier)
                })
            }
            console.log(_id)
        })
   }

function setItemValues(panier){
    let totalPrice = 0
    let totalItem = 0
    panier.map(arg => {
        totalPrice += (arg.price * arg.count) / 100
        totalItem += arg.count
    })
    counter.innerHTML = totalItem
    Strorage.storeTotalItem(totalItem)
    Strorage.storeTotalPrice(totalPrice)

} 
function setTotalItems(){
    counter.innerHTML = Strorage.getTotalPrice()
}

// Storage
class Strorage{
    static saveProducts(arg){
        const cameras = JSON.stringify(arg)
        localStorage.setItem('cameras', cameras)
    }
    static getproducts(id){
        const products = JSON.parse(localStorage.getItem('cameras'))
        return products.find(arg => arg._id === id)
    }
    static saveCart(cart){
        const panier = JSON.stringify(cart)
        localStorage.setItem('paniers', panier)
    }

    static storeTotalItem(totalItem){
        localStorage.setItem('totalItem', JSON.stringify(totalItem))
    }

    static storeTotalPrice(totalPrice){
        localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
    }

    static getTotalPrice(){
       if(localStorage.getItem('totalItem')){
           return JSON.parse(localStorage.getItem('totalItem'))
       }else{
           return 0
       }
    }
    static setIsDisabled(bool ,id){
        let disabledButton = [bool , id]
        localStorage.setItem('isDisabled', JSON.stringify(disabledButton))
    }

    static getIsDisabled(){
        if(localStorage.getItem('isDisabled') === 'true'){
            return true
        }else{
            return false
        }
    }

}

document.addEventListener('DOMContentLoaded', ()=> {
    fetchData()
    .then(response => {
        display(response)
        Strorage.saveProducts(response)
        if(!localStorage.getItem('paniers')){
            localStorage.setItem('paniers',  JSON.stringify(new Array()))
        }
    })
    .then(()=> {
        getButtons()
        setTotalItems()
    })
})