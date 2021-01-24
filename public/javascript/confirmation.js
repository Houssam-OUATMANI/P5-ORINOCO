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

// end injection HTML


// GENERE PDF RECAPITULATIF
const {firstName,lastName,address,city,email} = order.contact
function recapitulatifPDF(){
    const pdfDoc = new jsPDF()
    pdfDoc.setFillColor("black")
    pdfDoc.setTextColor("#000")
    pdfDoc.setFontSize(17)
    pdfDoc.setFont("Roboto")
    pdfDoc.text("RECAPITULATIF D'ACHAT",65, 20 )
    pdfDoc.text(`NUMERO DE COMMANDE : ${order.orderId}`,15, 35 )
    pdfDoc.text("----------------------------------------------------------------------------------------------------------", 0, 50 )
    pdfDoc.text(`PRENOM : ${firstName.toUpperCase()}`, 20, 65 )
    pdfDoc.text(`NOM : ${lastName.toUpperCase()}`, 20, 80 )
    pdfDoc.text(`ADRESSE : ${address}`, 20, 95 )
    pdfDoc.text(`VILLE : ${city}`, 20, 105 )
    pdfDoc.text(`EMAIL : ${email}`, 20, 120 )
    pdfDoc.text("-----------------------------------------------------------------------------------------------------------", 0, 135 )
    pdfDoc.setFontSize(16)
    pdfDoc.text(`MERCI D'AVOIR COMMANDER CHEZ ORINOCO ${firstName.toUpperCase()} ${lastName.toUpperCase()}\n`, 10, 150 )
    pdfDoc.setFontSize(14)
    pdfDoc.text("Orinoco boutique en ligne", 20, 200 )
    pdfDoc.text("Adresse : 50 rue du bidule PARIS 75011", 20 , 210 )
    pdfDoc.text("Email : orinoco@bidule.com", 20 , 220 )
    pdfDoc.setCreationDate()
    pdfDoc.save("recapitulatif_achat.pdf")
}
recapBtn.addEventListener('click',recapitulatifPDF)

