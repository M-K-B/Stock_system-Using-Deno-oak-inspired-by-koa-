

async function file2DataURI(file){
    return new Promise((resolve, reject) => {
        try{
            const reader = new FileReader()
            reader.onload = () => {
                resolve(reader.result)
            }
            reader.readAsDataURL(file)
        }catch(err){
            reject(err)
        }
    })
}

window.addEventListener('DOMContentLoaded', ()=>{
    console.log('DOMContentLoaded')
    document.querySelector('input[type="file"]').addEventListener('change', (event)=> displayImage(event))
})


async function displayImage(event){
    console.log('ADD File')
    const files = event.target.files
    const file = files[0]
    if(file){
        const data = await file2DataURI(file)
        const img = document.querySelector('form img')
        img.src = data
    }
}


console.log('hello')