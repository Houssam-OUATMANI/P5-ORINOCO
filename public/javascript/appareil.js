const cardHolder = document.querySelector('.card__holder')
const counter = document.querySelector('.counter')
const outerLoader= document.querySelector('.loader__outer')
const lensesContainer = document.querySelector('.lenses__container')

outerLoader.style.visibility = "visible"

const fetchOne = async () => {
    const _id = new URLSearchParams(window.location.search).get('id') 
    const url = `http://localhost:3000/api/cameras/${_id}`
    try{
        const data = await fetch(url)
        const response = await data.json()

        const{name ,description,imageUrl,price, lenses ,_id} = response

    
          
        
        outerLoader.style.display = "none"
        cardHolder.innerHTML =`
        <article class="card">
            <div class="card__img">
                <img src="${imageUrl}" alt="${name}">
            </div>
            <div class="card__info">
                 <h3>${name}</h3>
                <p>Prix <strong>${price / 100}$</strong> </p>
                
            </div>
            <div>
                <p>${description}</p>
            <div>
            <button class= "panier-btn" data-id=${_id} data-price =${price /100}>Ajouter au panier</button>
            
            </article>
            `   
            lenses.forEach(arg =>{
            lensesContainer.innerHTML +=`
                <input type="checkbox" name="${arg}" value="${arg}"> 
                <label>${arg}</label><br>
                `
            }) 
    }catch(err){
        throw new Error(`Well something wrong happend\n ${err}`)
    }
}

function getButton(){

    const panierBtn = document.querySelector('.panier-btn')
    const _id = panierBtn.dataset.id

    const getPaniers = JSON.parse(localStorage.getItem('paniers'))

    let clickedOne
    if(getPaniers !== null){
        clickedOne = getPaniers.find(arg => arg._id === _id)
    }

    if(clickedOne){
        panierBtn.innerHTML = "Ajouté au panier !"
        panierBtn.disabled = true
    }
    else{
        panierBtn.addEventListener('click', ()=> {
            panierBtn.innerHTML = "Ajouté au panier !"
            panierBtn.disabled = true
            let price = +panierBtn.dataset.price
            console.log(price)
            let targetItem = {...Storage.getproducts(_id), count : 1 , added :true}
            panier = [...JSON.parse(localStorage.getItem('paniers')), targetItem]
            Storage.saveCart(panier)
            let totalItem = JSON.parse(localStorage.getItem('totalItem'))
            let totalPrice = JSON.parse(localStorage.getItem('totalPrice'))
            totalPrice += price 
            totalItem += 1
            localStorage.setItem('totalItem', JSON.stringify(totalItem))
            localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
            counter.innerHTML = +counter.innerHTML + 1
        })
    }
}


function setTotalItem(){
    let totalItem = localStorage.getItem('totalItem')
    if (totalItem){
        counter.innerHTML= totalItem
    }
   return totalItem
}



class Storage {
    static getproducts(id){
        const products = JSON.parse(localStorage.getItem('cameras'))
        return products.find(arg => arg._id === id)
    }
    static saveCart(cart){
        const panier = JSON.stringify(cart)
        localStorage.setItem('paniers', panier)
    }
}

document.addEventListener("DOMContentLoaded", ()=> {
    if(!localStorage.getItem('paniers')){
        localStorage.setItem('paniers', JSON.stringify([]))
    }
    fetchOne()
    .then(()=> {
        setTotalItem()
        getButton()
    })
})

    