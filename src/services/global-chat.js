import supabase from '../services/supabase';
/*
    # Broadcast vs Postgres Changes
    -------------------------------
    Para hacer un chat como el que estamos buscando crear, con Supabase tenemos dos APIs que podemos usar, ambas del servicio
    Realtime:
    1. Broadcast
    2. Postgres Changes

    Broadcast tiene algunas ventajas importantes:
    - Mayor performance, especialmente a mayor volumen de usuarios suscritos.
    - Muy simple de usar. Ni siquiera necesitamos configurar nada especial en el backend.

    Dicho esto, tiene una gran contra:
    - No incluye ningún tipo de persistencia de los datos.

    Como en un chat es probable que queramos mantener un historial de los mensajes enviados, Broadcast no es la mejor 
    alternativa.
    Por esta razón, vamos a migrar a usar Postgres.

    Lo primero que vamos a necesitar, es crear una tabla en nuestra base de datos de Supabase.
    La tabla que vamos a crear va a llamarse "global_chat" y va a estar en el schema "public".
*/
// Versión con "Postgres Changes".
/**
 * Trae los últimos mensajes de la base de datos.
 * 
 * @returns {Promise<{id: number, email: string, body: string|null, created_at: string}[]>}
 */
export async function loadLastGlobalChatMessages() {
    const { data, error } = await supabase
        .from('global_chat')
        .select();

    if(error) {
        console.error('[global-chat.js loadLastGlobalChatMessage] Error al traer los mensajes: ', error);
        throw error;
    }

    // Retornamos los mensajes.
    return data;
}

/**
 * Graba un nuevo mensaje de chat.
 * 
 * @param {{email: string, body: string}} data 
 * @returns {Promise}
 */
export async function saveGlobalChatMessage(data) {
    const { error } = await supabase
        // Para hacer consultas contra la base de datos, vamos a empezar típicamente con una llamada a "from", que
        // aclare con qué tabla quiero interactuar.
        .from('global_chat')
        // Luego, le vamos a indicar la acción que queremos realizar. En este caso, queremos insertar un registro,
        // así que usamos insert().
        .insert({
            email: data.email,
            body: data.body,
        });

    // Preguntamos si hay algún error.
    if(error) {
        console.error('[global-chat.js saveGlobalChatMessage] Error al insertar el registro: ', error);
        throw error;
    }
}

/**
 * Se suscribe para recibir los nuevos mensajes de chat.
 * 
 * @param {({}) => void} callback
 * @returns Promise
 */
export async function subscribeToGlobalChatNewMessages(callback) {
    // Para poder escuchar los cambios en la base de datos, nuevamente tenemos que sumarnos a algún canal. No importa
    // cual.
    const chatChannel = supabase.channel('global-chat', {
        config: {
            broadcast: {
                self: true,
            },
        },
    });
    chatChannel.on(
        'postgres_changes', // Pedimos escuchar eventos de cambios en la base de datos.
        {
            // En "postgres_changes", el evento tiene que ser uno de los posibles valores: 'INSERT', 'UPDATE', 'DELETE' o '*'.
            event: 'INSERT',
            schema: 'public', // Aclaramos el schema que queremos consultar.
            table: 'global_chat', // Aclaramos la tabla que queremos escuchar.
        },
        data => {
            // Los datos del registro insertado llegan en la propiedad "new".
            callback(data.new);
        }
    );
    // Nos suscribimos.
    chatChannel.subscribe();
}

// Versión con "Broadcast".
// Seteamos un "listener" para recibir los mensajes emitidos en tiempo real por el "canal" "global-chat" 
// (nombre arbitrario).
// const globalChatChannel = supabase.channel('global-chat', {
//     config: {
//         broadcast: { self: true },
//     }
// });

// /**
//  * Graba un nuevo mensaje de chat.
//  * 
//  * @param {{id: string|number, email: string, body: string, created_at: string}} data 
//  * @returns Promise
//  */
// export async function saveGlobalChatMessage(data) {
//     const res = await globalChatChannel.send({
//         type: 'broadcast',
//         event: 'new-message', // El mismo que estén escuchando abajo.
//         payload: {
//             ...data,
//         }
//     });
// }

// /**
//  * Se suscribe para recibir los nuevos mensajes de chat.
//  * 
//  * @param {({}) => void} callback
//  * @returns Promise
//  */
// export async function subscribeToGlobalChatNewMessages(callback) {
//     // Definimos que se escuche el evento de emisión "new-message" (nombre arbitrario).
//     globalChatChannel.on(
//         'broadcast', // Esto es fijo para nuestro caso.
//         {
//             event: 'new-message', // Acá es lo que quieran.
//         },
//         data => {
//             console.log("Data recibida en tiempo real: ", data);
//             // Invocamos el callback que recibimos como argumento de la función.
//             callback(data.payload);
//         } // El callback para cada mensaje recibido.
//     );
//     // Nos suscribimos al canal.
//     globalChatChannel.subscribe();
// }