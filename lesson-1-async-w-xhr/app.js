(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText = 'zoo';
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        // searchedForText = searchField.value;
    });

    const unsplashRequest = new XMLHttpRequest();
    unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
    unsplashRequest.onload = addImage;
    unsplashRequest.setRequestHeader('Authorization', 'Client-ID a6a7013be4c412d0d5498ede7391f6291edddf3654ef9c485feada7d7a2fd963');
    unsplashRequest.send();

    function addImage() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];
            htmlContent = `<figure>
                        <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                        </figure>`;
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    const articleRequest = new XMLHttpRequest();
    articleRequest.onload = addArticles;
    articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=aa3231dffd23466fb4edfbfea3f17c43`);
    articleRequest.send();

    function addArticles () {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data && data.results && data.results[0]) {
            const firstArticle = data.results[0];
            htmlContent = `<article>
                        <h1>${firstArticle.urls.regular}</h1>
                        <p>${searchedForText} by ${firstArticle.user.name}</p>`;
        } else {
            htmlContent = '<div class="error-no-articles">No articles available</div>';
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }
})();
