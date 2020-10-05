console.log('hello')
const form = document.querySelector('form')
const API_URL = (window.location.hostname === '127.0.0.1' || window.location.origin === "file://") ? 'http://localhost:5000/mews' : 'https://meower-api.now.sh/v2/mews';
console.log(window.location)

const loading = document.querySelector('.loading')
const mewsList = document.querySelector('.mews')
loading.style.display = 'none'

listAllMews()
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form)
    const name = formData.get('name')
    const content = formData.get('content')
    const mew = {
        name,
        content
    }
    loading.style.display = 'block'
    form.style.display = 'none'
    fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(mew),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(createdMew => {
            //console.log(createdMew)
            listAllMews()
            form.reset();
            loading.style.display = 'none'
            form.style.display = 'block'
        })


})

function listAllMews() {
    mewsList.innerHTML = ''
    fetch(API_URL, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(mews => {
            loading.style.display = 'none'
            form.style.display = 'block'
            console.log(mews)
            mews.reverse()
            mews.forEach(mew => {
                const header = document.createElement('h3')
                header.textContent = mew.name
                const content = document.createElement('p')
                content.textContent = mew.content
                const date = document.createElement('p')
                date.textContent = new Date(mew.created)
                const div = document.createElement('div')
                div.appendChild(header)
                div.appendChild(content)
                div.appendChild(date)
                mewsList.appendChild(div)
            })
        })
}