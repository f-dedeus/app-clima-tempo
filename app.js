document.getElementById('searchBtn').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    if (city === '') {
        alert('Por favor, insira o nome de uma cidade');
        return;
    }
    // Insira sua chave da OpenWeatherMap aqui
    const apiKey = '9b0437d3c0c8cc7114a40be128d81371'; 
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    document.getElementById('loading').style.display = 'block';
    document.getElementById('weatherResults').innerHTML = '';
    document.getElementById('error').style.display = 'none';

    // Fazer a busca de latitude e longitude
    fetch(geocodingUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar coordenadas');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                throw new Error('Cidade não encontrada');
            }

            const { lat, lon } = data[0];

            // Chamar a API do clima com as coordenadas
            const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&lang=pt_br&units=metric`;

            return fetch(weatherUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados meteorológicos');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('loading').style.display = 'none';
            const weatherData = `
                <h2>Clima para ${city}</h2>
                <p>Temperatura: ${data.current.temp} °C</p>
                <p>Umidade: ${data.current.humidity}%</p>
                <p>Clima: ${data.current.weather[0].description}</p>
                <img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png" alt="ícone do clima">
            `;
            document.getElementById('weatherResults').innerHTML = weatherData;
        })
        .catch(error => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error').style.display = 'block';
            console.error(error);
        });
});
