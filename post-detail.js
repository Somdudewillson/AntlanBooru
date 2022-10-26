const searchSection = document.getElementById("search-box");
const resultsSection = document.getElementById("posts");
const detailSection = document.getElementById("post-detail");

const detailImgElement = document.getElementById("full-post");
const detailPromptElement = document.getElementById("post-prompt");
const detailSeedElement = document.getElementById("post-seed");

function returnToResults() {
    searchSection.style.display = "block";
    resultsSection.style.display = "block";
    detailSection.style.display = "none";

    detailImgElement.setAttribute("src", "");
    detailPromptElement.innerText='';
    detailSeedElement.innerText='';
}

function openDetail(linkElement) {
    searchSection.style.display = "none";
    resultsSection.style.display = "none";
    detailSection.style.display = "block";

    const previewImgElement = linkElement.getElementsByClassName("post-preview-image")[0];

    detailImgElement.setAttribute("src", previewImgElement.src);
    detailPromptElement.innerText=previewImgElement.dataset.prompt;
    detailSeedElement.innerText=previewImgElement.dataset.seed;
}