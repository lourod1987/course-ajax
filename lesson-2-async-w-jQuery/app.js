/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: 'Client-ID a6a7013be4c412d0d5498ede7391f6291edddf3654ef9c485feada7d7a2fd963'
            },
            dataType: 'json'
        }).done(addImage)
            .fail(function (err) {
                requestError(err, 'image');
            });

        function addImage(data) {
            const firstImage = data.results[0];

            responseContainer.insertAdjacentHTML('afterbegin', `<figure>
                        <img src="${firstImage.urls.small}" alt="${searchedForText}">
                        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                        </figure>`
            );
        }

        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=aa3231dffd23466fb4edfbfea3f17c43`,
            dataType: 'json'
        }).done(addArticles)
            .fail(function (err) {
                requestError(err, 'article');
            });

        function addArticles(data) {
            const articles = data.response.docs;
            responseContainer.insertAdjacentHTML('beforeend', '<ul>' + articles.map(article => `<li class="article">
                            <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                            <p>${article.snippet}</p>
                            </li>`
            ).join('') + '</ul>');
        }
    });
})();
