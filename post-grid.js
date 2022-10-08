const aspectRatios = [[640,640],[512,768],[768,512]];

const postsContainer = document.getElementsByClassName("posts-container")[0];

async function searchForPosts(formObject) {
    postsContainer.innerHTML = '';
    const selectedRatio = formObject["aspect-ratio"].value;
    const scale = Cookies.get('cfg_scale')!=undefined?Cookies.get('cfg_scale'):11;
    const uc = Cookies.get('user_uc')!=undefined?Cookies.get('user_uc'):'';

    const prompt = formObject["prompt"].value.trim();
    if (prompt.length <= 0) { return; }

    const resultCount = formObject["result-quantity"].value;
    var loaders = [];
    for (let i=0;i<resultCount;i++) {
        var newLoader = document.createElement("span");
        newLoader.setAttribute('class','post-preview-image loader')

        var newLoaderContainer = document.createElement("div");
        newLoaderContainer.setAttribute('class','post-preview-image placeholder')
        newLoaderContainer.appendChild(newLoader);

        postsContainer.appendChild(newLoaderContainer);
        loaders.push(newLoaderContainer);
    }

    var seed = formObject["start-seed"].value;
    const shuffleRatio = selectedRatio == -1;
    for (const loader of loaders) {
        const imageSize = shuffleRatio?aspectRatios[Math.floor(Math.random() * 3)]:aspectRatios[selectedRatio];
        const next_image_data = await fetchThumbnailImage(prompt, seed++, imageSize, scale, uc);

        var newImg = document.createElement("img");
        newImg.setAttribute("src", next_image_data.data);
        newImg.setAttribute('class','post-preview-image')

        var newLink = document.createElement("a");
        newLink.setAttribute("href", "#");
        newLink.setAttribute("onclick", "openDetail(this)");
        newLink.appendChild(newImg);

        loader.replaceWith(newLink);
    }
}

async function fetchThumbnailImage(prompt, seed, size, scale, uc='') {
    return await NovelAI_API.generateImage(prompt,'nai-diffusion',seed,size[0],size[1],28,'k_euler_ancestral',scale,uc.length===0?0:2,uc);
}