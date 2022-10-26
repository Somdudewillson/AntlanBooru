const aspectRatios = [[640,640],[512,768],[768,512]];
const artists = ['Agnes Lawrence Pelton','Akihito Yoshida','Albert Bierstadt','Andy Warhol','Annibale Carracci','Anthony Van Dyck','Artstation','Asaf Hanuka','Assassin\'s Creed','Aubrey Beardsley','Ben Enwonwu','Bob Byerley','Camille Corot','Caravaggio Michelangelo Merisi','Caspar David Friedrich','Charlie Bowater','Claude Monet','David Mann','Diego Rivera','Dorothea Tanning','Edward Munch','Fernando Botero','Frank Frazetta','Frida Kahlo','Hassan Mossoudy','Hayao Miyazaki','Hazem Taha Hussein','Hieronymus Bosch','H.R. Giger','Ismail Inceoglu','Ivan Shishkin','Jeff Koons','John Constable','John Kenn Mortensen','Jose Tapiro Y Baro','Karol Bak','Katsushika Hokusai','Kiki Smith','Kim Tschang Yeul','Ko Young Hoon','Laurie Lipton','Lee Man Fong','Lemma Guya','Lisa Frank','Mahmoud Sai','Malika Agueznay','Maria Sibylla Merian','Mark Brooks','Nam June Paik','Octane render','Paolo Uccello','Pauline Haynes','Pebble Tay','Pieter Bruegel The Elder','Pre-Raphaelite Brotherhood','Raffaello Sanzio','Ralph Steadman','Remedios Varo Uranga','Rene Magritte','Richard Dadd','Roy Liechtestein','Salvador Dali','Sonia Delaunay','Takashi Murakami','Tivadar Csontváry Kosztka','Tony Diterlizzi','Victto Ngai','Wanda Gág','Wangechi Mutu','Unreal Engine','Weta Digital','Wētā FX','WLOP','Yaoy Kusama','Yoshitaka Amano','Zeng Fanzhi','Ai yazawa','Cindy Sherman','Diane Arbus','Brassaï','Francisco Goya','Man Ray','Brom','van Gogh'];

const postsContainer = document.getElementsByClassName("posts-container")[0];

async function searchForPosts(formObject) {
    postsContainer.innerHTML = '';
    const selectedRatio = formObject["aspect-ratio"].value;
    const scale = Cookies.get('cfg_scale')!=undefined?Cookies.get('cfg_scale'):11;
    const ucPreset = Cookies.get('uc_preset')!=undefined?Cookies.get('uc_preset'):0;
    const uc = Cookies.get('user_uc')!=undefined?Cookies.get('user_uc'):'';
    const resultCount = formObject["result-quantity"].value;

    const prompt = formObject["prompt"].value.trim();
    if (prompt.length <= 0) { return; }

    // Modify prompt
    var appendArray = Array(prompt.length).fill('');
    const artistType = formObject["artist-injection"].value;
    const artistAmp = formObject["artist-amp"].value;
    switch (artistType) {
        case 'known':
            for (let i = 0; i < appendArray.length; i+=5) {
                var selectedArtist = artists[Math.floor(Math.random() * artists.length)];
                selectedArtist = ', '+"{".repeat(artistAmp)+'by '+selectedArtist+"}".repeat(artistAmp);
                appendArray = appendArray.fill(selectedArtist,i,i+5);
            }
            break;
        default:
            break;
    }

    // Generate loaders
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
    var idx = 0;
    const shuffleRatio = selectedRatio == -1;
    for (const loader of loaders) {
        const imageSize = shuffleRatio?aspectRatios[Math.floor(Math.random() * 3)]:aspectRatios[selectedRatio];
        const augPrompt = prompt+appendArray[idx++];
        const next_image_data = await fetchThumbnailImage(augPrompt, seed, imageSize, scale, ucPreset, uc);

        var newImg = document.createElement("img");
        newImg.setAttribute("src", next_image_data.data);
        newImg.setAttribute("title", augPrompt);
        newImg.dataset.prompt = augPrompt;
        newImg.dataset.seed = seed;
        newImg.setAttribute('class','post-preview-image')

        var newLink = document.createElement("a");
        newLink.setAttribute("href", "#");
        newLink.setAttribute("onclick", "openDetail(this)");
        newLink.appendChild(newImg);

        loader.replaceWith(newLink);
        seed++;
    }
}

async function fetchThumbnailImage(prompt, seed, size, scale, ucPreset=2, uc='') {
    return await NovelAI_API.generateImage(prompt,'nai-diffusion',seed,size[0],size[1],28,'k_euler_ancestral',scale,ucPreset,uc);
}