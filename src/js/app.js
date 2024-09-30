document.getElementById('searchBtn').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    if (city === '') {
        alert('Por favor, insira o nome de uma cidade');
        return;
    }
    // funcao para buscar dados da API
    function getWeatherData(city){
         // Insira sua chave da WeatherApi aqui
        const apiKey = '471ec5ff85e448b49b3185905241609'; 
        const weatherapi = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no&lang=pt`;

        document.getElementById('loading').style.display = 'block';
        document.getElementById('weatherResults').innerHTML = '';
        document.getElementById('weather-info').innerHTML = '';
        document.getElementById('error').style.display = 'none';

        return fetch(weatherapi)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Cidade não encontrada');
                }
                return response.json();
            });
    }

    //funcao para processar os dados 
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
        document.getElementById('weather-info').innerHTML = weatherData;
        document.getElementById('loading').style.display = 'none'; // Esconde o loader
    }

    // Chamar a API e tratar erros
    getWeatherData(city)
        .then(processWeatherData)
        .catch((error) => {
            console.error('Erro:', error);
            document.getElementById('loading').style.display = 'none';  // Esconde o loader
            document.getElementById('error').style.display = 'block';  // Mostra a mensagem de erro
        });

    function init() {
        document.getElementById('searchBtn').addEventListener('click', function() {
          const city = document.getElementById('city').value;
          if (!city) {
            alert('Por favor, insira o nome de uma cidade');
            return;
          }
      
          getWeatherData(city)
            .then(processWeatherData)
            .catch(() => {
              document.getElementById('error').style.display = 'block';
            });
        });
      }
      
      // Inicializa o evento ao carregar o DOM
      document.addEventListener('DOMContentLoaded', init);

});
