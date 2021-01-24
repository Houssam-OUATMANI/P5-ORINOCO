const order = JSON.parse(localStorage.getItem('order'))

const outerLoader= document.querySelector('.loader__outer')

const recapBtn = document.querySelector('.recap')
const {products} = order
const title = order.products.length == 1 ? 'VOTRE COMMANDE' : 'VOS COMMANDES'

const rendeOrder = document.querySelector('.render__order')
const orderId = document.querySelector(".order-id")


outerLoader.style.visibility = "visible"
// injection HTML
orderId.innerHTML= `NUMERO DE COMMANDE : ${order.orderId}`
outerLoader.remove()
products.forEach(arg => {
    rendeOrder.innerHTML += `
        <article class="order__article">
           <h3>${arg.name}</h3>
           <p class=" id" >Identifiant du produit : ${arg._id}</p>
           <p class="price">prix du  produit : <span>$${arg.price / 100}</span></p>
        </article>`
})

const {firstName,lastName,address,city,email} = order.contact
function recapitulatifPDF(){
    const pdfDoc = new jsPDF()
    pdfDoc.text("RECAPITULATIF DACHAT",70, 20 )
    pdfDoc.text(`NUMERO DE COMMANDE : ${order.orderId}`,20, 35 )
    pdfDoc.text("------------------------------------------", 70, 50 )
    pdfDoc.text(`PRENOM : ${firstName.toUpperCase()}`, 20, 95 )
    pdfDoc.text(`NOM : ${lastName.toUpperCase()}`, 20, 105 )
    pdfDoc.text(`ADRESSE : ${address}`, 20, 115 )
    pdfDoc.text(`VILLE : ${city}`, 20, 125 )
    pdfDoc.text(`EMAIL : ${email}`, 20, 135 )
    pdfDoc.text("------------------------------------------", 70, 180 )
    pdfDoc.text(`MERCI D'AVOIR COMMANDER CHEZ ORINOCO ${firstName.toUpperCase()} ${lastName.toUpperCase()}\n`, 10, 280 )
    pdfDoc.save("recapitulatif_achat.pdf")
}
recapBtn.addEventListener('click',recapitulatifPDF)

// end injection HTML
