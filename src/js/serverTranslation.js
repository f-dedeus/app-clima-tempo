import express from 'express';
import cors from 'cors'; // Importa o cors
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// Usando o middleware cors
app.use(cors()); // Isso permitirá todas as origens. Você pode configurar mais tarde se necessário.

app.use(express.json());

// Rota para traduzir a cidade
app.post('/translate', async (req, res) => {
    const { city, direction } = req.body; // Recebe a cidade e a direção
    const apiKey = '3185eb38-b583-4f4d-854f-aec334a41bef:fx'; // Substitua pela sua chave da API do DeepL
    const url = 'https://api-free.deepl.com/v2/translate';

    const params = new URLSearchParams();
    params.append('auth_key', apiKey);
    params.append('text', city);

    // Define o idioma alvo baseado na direção da tradução
    const targetLang = direction === 'pt-en' ? 'EN' : 'PT';
    params.append('target_lang', targetLang);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const data = await response.json();
        if (data.translations && data.translations.length > 0) {
            res.json({ translatedCity: data.translations[0].text });
        } else {
            res.status(500).json({ error: 'Erro na tradução' });
        }
    } catch (error) {
        console.error('Erro ao traduzir a cidade:', error);
        res.status(500).json({ error: 'Erro ao traduzir a cidade' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
