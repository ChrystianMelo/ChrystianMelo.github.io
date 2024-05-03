// Função para buscar os documentos da pasta de certificados do GitHub
$(document).ready(function () {
    var repoUrl = "https://api.github.com/repos/ChrystianMelo/ChrystianMelo.github.io/contents/Certificados";

    function generateThumbnail(pdfUrl) {
        return new Promise((resolve, reject) => {
            // Cria um canvas para renderizar a miniatura do PDF
            var canvas = document.createElement('canvas');
            canvas.width = 50; // largura da miniatura
            canvas.height = 50; // altura da miniatura
            var context = canvas.getContext('2d');
            if (!context) {
                console.error("Canvas context not supported.");
                reject("Canvas context not supported.");
            }

            pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
                // Renderiza a primeira página do PDF
                pdf.getPage(1).then(function (page) {
                    var viewport = page.getViewport({ scale: 0.1 }); // escala para miniatura
                    page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise.then(function () {
                        // Converte o canvas para uma imagem base64
                        var thumbnailUrl = canvas.toDataURL('image/png');
                        // Resolve a promessa com a URL base64 da miniatura
                        resolve(thumbnailUrl);
                    });
                });
            }).catch(function (error) {
                console.error("Error rendering PDF:", error);
                reject(error);
            });
        });
    }

    $.get(repoUrl, function (data) {
        var certificatesList = $("#certificates-list");
        if (certificatesList.length === 0) {
            console.error("#certificates-list not found.");
            return;
        }
        var index = 0;
        data.forEach(function (item) {
            if (item.type === "file" && item.name.toLowerCase().endsWith(".pdf")) {
                var downloadUrl = item.download_url;
                var containerId = "certificate-" + index;
                index++;

                // Adiciona um contêiner para o certificado
                certificatesList.append("<div id='" + containerId + "' class='col-md-6'>");


                // Gera a miniatura do PDF e adiciona ao contêiner
                generateThumbnail(downloadUrl).then(function (thumbnailUrl) {
                    $("#" + containerId).append(
                        "<div class='events-item'>" +
                        "<img src='" + thumbnailUrl + "' class='card-img-top fixed-img' alt='Event 2 Preview'>" +
                        "<h5>" + item.name.replace(/\.[^/.]+$/, '') + "</h5>" +
                        "<a href='" + downloadUrl + "' class='btn btn-primary' download>Download Certificate</a></div>");
                }).catch(function (error) {
                    console.error("Error generating thumbnail:", error);
                });

                certificatesList.append("</div>");
            }
        });
    });
});

// Função para buscar os repositórios em destaque do GitHub
$(document).ready(function () {
    const url = `https://api.github.com/users/chrystianmelo/repos`;

    fetch(url)
        .then(response => response.json())
        .then(starredRepos => {
            const portfolioItems = document.getElementById('portfolio-items');
            portfolioItems.innerHTML = ''; // Limpa qualquer conteúdo existente

            starredRepos.forEach(repo => {
                const repoItem = `
                            <div class="col-md-6">
                                <div class="portfolio-item">
                                    <h3>${repo.name}</h3>
                                    <p>${repo.description}</p>
                                    <p><a href="${repo.html_url}">${repo.html_url}</a></p>
                                </div>
                            </div>
                        `;
                portfolioItems.innerHTML += repoItem; // Adiciona o item do repositório ao DOM
            });
        })
        .catch(error => console.error('Erro ao buscar repositórios:', error));
});