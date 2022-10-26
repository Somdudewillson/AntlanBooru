class NovelAI_API {
  static accessToken = undefined;
  static async trySetAccessToken(newToken) {
    const user_data = await fetch('https://api.novelai.net/user/data', {headers: this.buildHeaders(newToken)})
        .then((response) => response.json());
    
    if (user_data.statusCode == 401 || user_data.statusCode == 400) {
        return [false, 'Invalid access token'];
    }
    if (user_data.subscription.active && user_data.subscription.tier === 3) {
        this.accessToken = newToken;
        return [true, 'Access token updated'];
    }
    return [false, 'Insufficient subscription tier'];
  }

  static streamRegex = /event:\s*(.*)\nid:\s*(.*)\ndata:(.*)/s;
  static ucPresets = [
    'nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, blurry, blurry background, blur, blurred, long limbs, extra limbs, mutated, mutated limbs',
    'nsfw, lowres, text, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry',
    ''];
  static async generateImage(prompt, model, seed, width, height, steps, sampler, scale, ucPreset, uc = '', strength = 0.7, noise = 0.2) {
    if (this.accessToken === undefined) { return [false, 'No access token']; }

    const payload = {
        "input": prompt,
        "model": model,
        "parameters": {
            "width": width,
            "height": height,
            "scale": scale,
            "sampler": sampler,
            "steps": steps,
            "seed": seed,
            "n_samples": 1,
            "strength": strength,
            "noise": noise,
            "ucPreset": ucPreset,
            "uc": this.ucPresets[ucPreset]+(this.ucPresets[ucPreset].length>0 && uc.length>0 ? ', ' + uc:'')
        }
    }
    const result = await fetch('https://api.novelai.net/ai/generate-image',
            {
                method: 'POST',
                headers: this.buildHeaders(),
                body: JSON.stringify(payload)
            })
            .then((response) => response.body)
            .then(async (rb) => {
              const reader = rb.getReader();
              const dec = new TextDecoder("utf-8");

              var result = '';
              var next;
              do {
                next = await reader.read();
                if (!next.done) { result+=dec.decode(next.value); }
              } while (!next.done);

              return result;
            })
            .then((resultText)=>resultText.match(this.streamRegex))
            .then((splitResult)=>{return {"event":splitResult[1],"id":splitResult[2],"data":'data:image/jpeg;base64,'+splitResult[3]}});
    
    return result;
  }

  static buildHeaders(token = this.accessToken) {
    return new Headers({
        'authorization': token,
        'Content-Type': 'application/json'
      });
  }

  static {
    const access_key = Cookies.get("access_key");
    if (access_key != undefined) {
      this.accessToken = access_key;
    }
  }
}
