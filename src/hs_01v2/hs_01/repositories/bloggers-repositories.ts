export let bloggers = [
    {
        "id": 1,
        "name": "Dumych",
        "youtubeUrl": "https://www.youtube.com/c/ITINCUBATOR"
    },{
        "id": 2,
        "name": "it-kamasutra",
        "youtubeUrl": "https://www.youtube.com/c/ITKAMASUTRA"
    },{
        "id": 3,
        "name": "UlbiTV",
        "youtubeUrl": "https://www.youtube.com/c/UlbiTV"
    },
]

// let expression = '/^https:\/\/([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/'
let expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi

export const bloggersRepositories = {
    findBloggers(){
        return bloggers
    },
    findBloggerId(bloggerId:number){
        const findBloggerId = bloggers.find(v=>v.id === bloggerId)
        if(findBloggerId){
            return findBloggerId
        }
        return ''

    },
    removeBloggerId(bloggerId:number){
        const findBloggerId = bloggers.filter(v=>v.id === bloggerId)
        if(findBloggerId.length < bloggers.length){
            return true
        }
        return false

    },
    createBlogger(name:string, youtubeUrl:string){
        let regex = new RegExp(expression);
        let validateUrl = false
        if (youtubeUrl.match(regex)) {
            validateUrl = false
        } else {
            validateUrl = true
        }
        if(validateUrl || !name || name.length > 15 || youtubeUrl.length > 100){
            const errorsMessages =[]
            if(validateUrl || youtubeUrl.length > 100){
                errorsMessages.push({
                    message: "non validation url",
                    field: "youtubeUrl"
                })
            } if(name.length > 15 || !name){
                errorsMessages.push({
                    message: "non validation name ",
                    field: "name"
                })
            }
            return {"errorsMessages": errorsMessages ,error:true}
        }

        if(name.length <= 15 && youtubeUrl.length < 101){
            const newVideo = {
                "id": bloggers.length+1,
                "name":name,
                "youtubeUrl": youtubeUrl
            }
            bloggers.push(newVideo)
            return {newVideo:newVideo,error:false}

        }
    },
    updateBlogger(bloggerId:number,newName:string,newYoutubeUrl:string){
        const videoId = bloggers.find(v=>v.id === bloggerId)
        let regex = new RegExp(expression);
        let validateUrl = false
        if (newYoutubeUrl.match(regex)) {
            validateUrl = false
        } else {
            validateUrl = true
        }
        if(validateUrl || newName.trim()?.length > 15 || !newName || newYoutubeUrl.length > 100){
            const errorsMessages =[]
            if(validateUrl || newYoutubeUrl.length > 100){
                errorsMessages.push({
                    message: "non validation url",
                    field: "youtubeUrl"
                })
            } if(newName.length > 15 || !newName.trim()){
                errorsMessages.push({
                    message: "non validation name ",
                    field: "name"
                })
            }
            return({"errorsMessages": errorsMessages,error:400})
        }
        if(videoId && newName.length <= 15 && newYoutubeUrl.length <= 100 ){
            videoId.name = newName
            videoId.youtubeUrl = newYoutubeUrl
            return {videoId:videoId,error:204}
        }
        if(!videoId){
            return {error: 404}
        }
    },

}
