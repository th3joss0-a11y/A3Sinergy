exports.handler = async function(event, context) {
    // 1. Cabeceras CORS abiertas para permitir acceso desde tus otras webs
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // 2. Recibir los datos de la URL
    const nacionalidad = event.queryStringParameters.nacionalidad;
    const cedula = event.queryStringParameters.cedula;

    if (!nacionalidad || !cedula) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: true, error_str: 'Faltan parámetros' })
        };
    }

    // 3. Credenciales de la API
    const appId = '3101';
    // AQUÍ ESTÁ LA MAGIA: Netlify inyectará tu token de forma invisible
    const token = process.env.TOKEN_API_CEDULA; 

    if (!token) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: true, error_str: 'Token de API no configurado en Netlify' })
        };
    }

    const url = `https://api.cedula.com.ve/api/v1?app_id=${appId}&token=${token}&nacionalidad=${nacionalidad}&cedula=${cedula}`;

    try {
        // 4. Hacer la consulta
        const response = await fetch(url);
        const data = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: true, error_str: 'Fallo al conectar con el servidor de origen' })
        };
    }
}