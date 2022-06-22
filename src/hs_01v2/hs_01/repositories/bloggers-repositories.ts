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
        const newVideo = {
            "id": bloggers.length+1,
            "name":name,
            "youtubeUrl": youtubeUrl
        }
        bloggers.push(newVideo)
        return {newVideo:newVideo,error:false}
    },
    updateBlogger(bloggerId:number,newName:string,newYoutubeUrl:string){
        const videoId = bloggers.find(v=>v.id === bloggerId)
        if(videoId){
            videoId.name = newName
            videoId.youtubeUrl = newYoutubeUrl
            return {videoId:videoId,error:204}
        }
        if(!videoId){
            return {error: 404}
        }
    },

}
