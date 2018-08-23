(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (evt) {
        evt.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        //fetch images from Unsplash API related to the user query, send header with Authorization ID, and report any errors to user + dev
        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID a6a7013be4c412d0d5498ede7391f6291edddf3654ef9c485feada7d7a2fd963'
            }
        }).then(response => response.json())
            .then(addImage)
            .catch(err => requestError(err, 'image'));

        //fetch NY Times articles related to the user query and report any errors to user + dev
        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=aa3231dffd23466fb4edfbfea3f17c43`)
            .then(response => response.json())
            .then(addArticles)
            .catch(err => requestError(err, 'article(s)'));

        //fn is called when fetch to Unsplash API is successful and returns either the first image or a message notifying the user there are no images related to the query
        function addImage(data) {
            let htmlContent = '';
            const firstImage = data.results[0];

            if (firstImage) {
                htmlContent = `<figure>
                            <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                            </figure>`;
            } else {
                htmlContent = '<div class="error-no-image">No images available</div>';
            }

            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }

        //fn is called when fetch to NY Times API is successful and returns either a list of articles or tells the user their are no articles related to the query
        function addArticles(data) {
            let htmlContent = '';
            const articles = data.response.docs;

            if (articles) {
                htmlContent = '<ul>' + articles.map(article => `<li class="article">
                            <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                            <p>${article.snippet}</p>
                            </li>`
                ).join('') + '</ul>';
            } else {
                htmlContent = '<div class="error-no-articles">No articles available</div>';
            }

            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }

        //this fn is called if any issues occur with network or with the fetch request itself
        function requestError(err, part) {
            console.log(err);
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
        }
    });
})();
