document.getElementById('searchBtn').addEventListener('click', async function() {
    const city = document.getElementById('city').value;
    
    if (city === '') {
        alert('Por favor, insira o nome de uma cidade');
        return;
    }

    try {
        // Exibe o carregamento
        document.getElementById('loading').style.display = 'block';
        // Limpa resultados anteriores e mensagens de erro
        document.getElementById('weather-info').innerHTML = '';
        document.getElementById('error').style.display = 'none';

        // Função assíncrona para buscar os dados da API
        const weatherData = await getWeatherData(city);
        // Processa e exibe os dados
        processWeatherData(weatherData);
        
    } catch (error) {
        // Esconde o loader e exibe mensagem de erro se ocorrer um problema
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        console.error('Erro na busca do clima:', error);
    }
});

// Função assíncrona para fazer a requisição à API usando axios
async function getWeatherData(city) {
    const apiKey = '471ec5ff85e448b49b3185905241609'; // Insira sua chave da WeatherAPI
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no&lang=pt`;

    try {
        // Faz a requisição HTTP e aguarda a resposta
        const response = await axios.get(url);
        // Retorna os dados se a resposta for bem-sucedida
        return response.data;
    } catch (error) {
        // Se a cidade não for encontrada ou houver outro erro, lança uma exceção
        throw new Error('Cidade não encontrada ou erro na requisição.');
    }
}

// Função para processar e exibir os dados do clima
function processWeatherData(data) {
    const weatherData = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <p>Temperatura Atual: ${data.current.temp_c} °C</p>
        <p>Umidade Atual: ${data.current.humidity}%</p>
        <p>Clima Atual: ${data.current.condition.text}</p>
        <img src="https:${data.current.condition.icon}" alt="ícone do clima">
        <h3>Previsão do Tempo para os Próximos 5 Dias</h3>
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

    // Exibe os dados no HTML
    document.getElementById('weather-info').innerHTML = weatherData;
    // Esconde o loader
    document.getElementById('loading').style.display = 'none';
}
