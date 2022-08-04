//Muestra productos

document.addEventListener("DOMContentLoaded", async () => {

    const prodList = document.querySelector('#storeList')

    const template = Handlebars.compile(await (await fetch('../views/storeProd.hbs')).text());

    const data = await (await fetch('/api/productos')).json()

    prodList.innerHTML = template({ productos: data })

    await updateCartQty()

    document.querySelectorAll('.btnAddToCart').forEach(btn => btn.addEventListener('click', addToCart))
})

const updateCartQty = async (qty) => {

    const cartCont = document.querySelector('#cartCont')
    if (qty) {
        cartCont.innerHTML = parseInt(cartCont.innerHTML) + qty
    } else {
        const list = await (await fetch('/api/carrito/auth/productos')).json()
        let cont = 0
        if (list.length) {
            for (const p of list) {
                cont += p.stock
            } 
        }
        cartCont.innerHTML = cont
    }
}

const addToCart = async (e) => {

    e.target.disabled = true
    const idProd = e.target.attributes.prodId.value

    const response = await (await fetch('/api/carrito/auth/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idProd: idProd, qty: 1 })
    })).json();

    if (!response.error) {
        await updateCartQty(1)
    } else {
        alert(JSON.stringify(response));
        location.reload();
    }
    e.target.disabled = false
}







