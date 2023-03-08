$.ajax({
    url: 'https://api.coingecko.com/api/v3/coins/list',
    type: 'GET',
    success: function (response) {
        console.log(response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log('Chyba p�i z�sk�v�n� dat: ' + textStatus);
    }
});


async function updatePrices() {
    try {
        const coinIds = ['bitcoin', 'ethereum', 'litecoin', 'bitcoin-cash'];
        const response = await $.ajax({
            url: `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join()}&vs_currencies=czk`,
            type: 'GET',
            dataType: 'json',
        });

        // Aktualizovat hodnoty v tabulce
        const timestamp = new Date().toLocaleString();
        coinIds.forEach((coinId) => {
            const price = response[coinId].czk;
            $(`#${coinId}-price`).text(price);
            $(`#${coinId}-timestamp`).text(timestamp);
        });
    } catch (error) {
        console.error('Nepoda�ilo se na��st ceny kryptom�n', error);
    }
}

$(document).ready(function () {
    // Nastavit interval pro pravidelnou aktualizaci cen
    const updateInterval = 10000; // 10 sekund
    setInterval(updatePrices, updateInterval);

    // Nastavit tla��tka pro manu�ln� aktualizaci
    const maxManualUpdatesPerMinute = 5;
    const coinIds = ['bitcoin', 'ethereum', 'litecoin', 'bitcoin-cash'];
    const manualUpdateCounts = {};
    coinIds.forEach((coinId) => {
        manualUpdateCounts[coinId] = 0;
        $(`#${coinId}-update`).click(() => {
            const currentTime = new Date().getTime();
            const lastUpdate = manualUpdateCounts[coinId];
            const elapsed = (currentTime - lastUpdate) / 1000; // v sekund�ch
            if (elapsed >= 60 / maxManualUpdatesPerMinute) {
                manualUpdateCounts[coinId] = currentTime;
                updatePrices();
            } else {
                const remaining = Math.ceil(60 / maxManualUpdatesPerMinute - elapsed);
                alert(`M��ete prov�st dal�� aktualizaci a� za ${remaining} sekund.`);
            }
        });
    });
});