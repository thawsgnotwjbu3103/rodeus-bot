import axios from "axios"

export async function getRandomMeme() {
    const response = await axios({
        url: `${process.env.BASE_URL}/gimme`
    })
    return response.data;
}

export async function getRandomMemeBySubReddit(subreddit: string) {
    const arr = ['memes', 'dankmemes', 'me_irl'];
    if(arr.includes(subreddit)) {
        const response = await axios({
            url: `${process.env.BASE_URL}/gimme/${subreddit}`
        })
        return response.data;
    }
    return {
        title: "bro, there's only memes, dankmemes, me_irl",
        url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
    }
}
