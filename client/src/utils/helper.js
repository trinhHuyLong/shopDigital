export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString()
export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')

export const validate = (payload,setInvalidFields)=>{
    let invalids = 0

    const formatPayload = Object.entries(payload)
    for(let arr of formatPayload) {
        if(arr[1].trim() === '') {
            invalids++
            setInvalidFields(prev=>[...prev,{name:arr[0],mes:'Required this field.'}])
        }
    }

    for(let arr of formatPayload) {
        console.log(arr)
        switch(arr[0]) {
            case 'email':
                const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if(!arr[1].match(regex)) {
                    invalids++
                    setInvalidFields(prev=>[...prev,{name:arr[0],mes:'Email invalid.'}])
                }
                break
            case "password":
                if(arr[1].length < 6){
                    invalids++
                    setInvalidFields(prev=>[...prev,{name:arr[0],mes:'Password must be at least 6 characters.'}])
                }
                break
            default:
                break
        }
    }


    return invalids
}