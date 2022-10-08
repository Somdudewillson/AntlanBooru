const searchSection = document.getElementById("search-box");
const resultsSection = document.getElementById("posts");
const detailSection = document.getElementById("post-detail");

const detailImgElement = document.getElementById("full-post");
const detailPromptElement = document.getElementById("post-prompt");

function returnToResults() {
    searchSection.style.display = "block";
    resultsSection.style.display = "block";
    detailSection.style.display = "none";

    detailImgElement.setAttribute("src", "");
    detailPromptElement.innerText='';
}

function openDetail(linkElement) {
    searchSection.style.display = "none";
    resultsSection.style.display = "none";
    detailSection.style.display = "block";

    const previewImgElement = linkElement.getElementsByClassName("post-preview-image")[0];

    detailImgElement.setAttribute("src", previewImgElement.src);
    detailPromptElement.innerText=previewImgElement.title;
}