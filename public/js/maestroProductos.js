//Tratamiento del submit de un nuevo producto al server

document.addEventListener("DOMContentLoaded", async () => {
    
    const prodForm = document.querySelector('#prodForm')
    const prodList = document.querySelector('#prodList')
    const template = Handlebars.compile(await (await fetch('../views/tableProd.hbs')).text());

    const updateList = async () => {
        const data = await (await fetch('/api/productos')).json()
        prodList.innerHTML = template({ productos: data })
    }

    updateList()

    prodForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const check = await (await fetch('/checkAuth')).json()

        if (check.auth) {
            let body = new FormData(prodForm)
            const prod = {
                title: body.get('productTitle'),
                price: parseFloat(body.get('productPrice')), //Necesario convertir a Number
                thumbnail: body.get('productImgUrl')
            }

            // TODO: POST API PRODUCTOS

            prodForm.reset()

            updateList()

        } else {
            alert('Su sesión ha expirado!')
            location.reload();
        }
    })
})