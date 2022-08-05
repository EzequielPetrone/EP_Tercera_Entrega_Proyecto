//Muestra productos
const checkoutBtn = document.querySelector('#checkoutBtn')

document.addEventListener("DOMContentLoaded", async () => {

    const cartCont = document.querySelector('#cartCont')
    const cartAmount = document.querySelector('#cartAmount')
    const cartList = document.querySelector('#cartList')

    const template = Handlebars.compile(await (await fetch('../views/tableCart.hbs')).text());

    const updateCart = async () => {

        const list = await (await fetch('/api/carrito/auth/productos')).json()

        cartList.innerHTML = template({ productos: list })

        let cont = 0
        let monto = 0
        if (list.length) {
            for (const p of list) {
                cont += p.stock
                monto += (p.precio * p.stock)
            }
            checkoutBtn.disabled = false
        } else {
            checkoutBtn.disabled = true
        }
        cartCont.innerHTML = cont
        cartAmount.innerHTML = '$ ' + monto

        document.querySelectorAll('.btnDeleteFromCart').forEach(btn => btn.addEventListener('click', deleteFromCart))
    }

    await updateCart()

    async function deleteFromCart(e) {

        const prodId = e.target.attributes.prodId.value

        const response = await (await fetch('/api/carrito/auth/productos/' + prodId, {
            method: 'DELETE',
        })).json();

        if (!response.error) {
            await updateCart()
        } else {
            alert(JSON.stringify(response));
        }
    }
})

const goHome = () => location.href = '/'

const checkout = async () => {

    checkoutBtn.disabled = true
    checkoutBtn.innerHTML = 'PROCESANDO...'

    const response = await (await fetch('/api/carrito/auth/checkout', {
        method: 'POST'
    })).json();

    if (response.error) {
        alert(response.descripcion)
    } else {
        alert(`Gracias por tu compra ${response.name}! Te van a llegar las instrucciones de pago al correo: ${response.email}`)
    }

    goHome()
}
