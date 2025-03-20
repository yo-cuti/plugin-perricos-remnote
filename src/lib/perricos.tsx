
// mostly from: https://source.unsplash.com/random/600x600/?dog
const perricoAPIUrl = `https://dog.ceo/api/breeds/image/random`; 

interface RespuestaAPIPerro {
    message: string;
    status: string;
}

export const tomaPerrico = async (): Promise<string | null> => {
    try {
        const respuesta = await fetch(perricoAPIUrl)
        const data: RespuestaAPIPerro = await respuesta.json()
        if (data.message) {
            return data.message;
        } else {
            console.error("No se ha encontrado el perro");
            return null;
        }
    } catch (error) {
        // TypeError: Failed to fetch
        console.log('There was an error', error);
        return null;
    }
};