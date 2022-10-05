const searchSection = document.getElementById("search-box");
const resultsSection = document.getElementById("posts");
const detailSection = document.getElementById("post-detail");

const detailImgElement = document.getElementById("full-post");

function returnToResults() {
    searchSection.style.display = "block";
    resultsSection.style.display = "block";
    detailSection.style.display = "none";

    detailImgElement.setAttribute("src", "");
}

function openDetail(linkElement) {
    searchSection.style.display = "none";
    resultsSection.style.display = "none";
    detailSection.style.display = "block";

    detailImgElement.setAttribute("src", linkElement.getElementsByClassName("post-preview-image")[0].src);
}