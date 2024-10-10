import { API_WEATHER_KEY } from "../../conf.js";


document.getElementById('searchBtn').addEventListener('click', async function() {
    const city = document.getElementById('city').value;
    if (city === '') {
        alert('Por favor, insira o nome de uma cidade');
        return;
    }

    document.getElementById('loading').style.display = 'block';

    try {
        const weatherData = await getWeatherData(city);
        processWeatherData(weatherData);
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('loading').style.display = 'none'; // Esconde o loader
        document.getElementById('error').style.display = 'block'; // Mostra a mensagem de erro
    }
});
// Função para traduzir a cidade
async function translateCity(city, direction) {
    const response = await fetch(`http://localhost:3000/translate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ city: city, direction: direction }) // Passando a direção da tradução
    });

    if (!response.ok) {
        console.log(response)
        throw new Error('Erro ao traduzir a cidade');
    }

    const result = await response.json();
    return result.translatedCity; // A cidade traduzida
}

// Função assíncrona para fazer a requisição à API usando axios
async function getWeatherData(city) {
    const translatedCity = await translateCity(city, 'pt-en'); // Traduz a cidade para o inglês
    const weatherApiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_WEATHER_KEY}&q=${translatedCity}&days=5&aqi=no&alerts=no&lang=pt`;
    document.getElementById('loading').style.display = 'block';
    document.getElementById('weatherResults').innerHTML = '';
    document.getElementById('error').style.display = 'none';

    const response = await fetch(weatherApiUrl);
    if (!response.ok) {
        throw new Error('Cidade não encontrada');
    }

    const data = await response.json();

    // Traduza o nome da localização e do país de inglês para português
    const translatedLocationName = await translateCity(data.location.name, 'en-pt'); // Traduza o nome da localização para português
    const translatedCountryName = await translateCity(data.location.country, 'en-pt'); // Traduza o nome do país para português

    return { ...data, translatedLocationName, translatedCountryName }; // Retorna os dados do clima com as traduções
}

// Função para processar e exibir os dados do clima
function processWeatherData(data) {
    const weatherData = `
        <h2>${data.translatedLocationName}, ${data.translatedCountryName}</h2>
        <p>Temperatura Atual: ${data.current.temp_c} °C</p>
        <p>Umidade Atual: ${data.current.humidity}%</p>
        <p>Clima Atual: ${data.current.condition.text}</p>
        <img src="https:${data.current.condition.icon}" alt="ícone do clima">
        <h3>Previsão do Tempo para os Próximos 3 Dias</h3>
        ${data.forecast.forecastday.slice(0, 5).map(day => `
            <div>
                <h4>${new Date(day.date_epoch * 1000).toLocaleDateString()}</h4>
                <p>Temperatura Máxima: ${day.day.maxtemp_c} °C</p>
                <p>Temperatura Mínima: ${day.day.mintemp_c} °C</p>
                <p>Umidade Média: ${day.day.avghumidity}%</p>
                <p>Clima: ${day.day.condition.text}</p>
                <img src="https:${day.day.condition.icon}" alt="ícone do clima">
            </div>
        `).join('')}
    `;
    document.getElementById('weather-info').innerHTML = weatherData;
    document.getElementById('loading').style.display = 'none'; // Esconde o loader
}
