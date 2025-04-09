<script>
import MainH1 from '../components/MainH1.vue';
import supabase from '../services/supabase';

// TODO: Repasar más tranquis :D
// Seteamos un "listener" para recibir los mensajes emitidos en tiempo real por el "canal" "global-chat" 
// (nombre arbitrario).
const globalChatChannel = supabase.channel('global-chat', {
    config: {
        broadcast: { self: true },
    }
});

export default {
    name: 'GlobalChat',
    components: { MainH1 },
    // La propiedad "data" nos permite definir cuáles son los valores del "state" del componente.
    // Entiéndase por "state" los datos propios del componente que pueden variar duranta la vida del mismo.
    // Esta propiedad debe tener una función que retorne un objeto con los datos.
    // data: function() {
    //     return {}
    // },
    // data: () => {
    //     return {}
    // },
    data() {
        return {
            messages: [],
            newMessage: {
                email: '',
                body: '',
            },
        }
    },
    // La propiedad "methods" permite definir las funciones que queremos que el componente tenga.
    methods: {
        async sendMessage() {
            const res = await globalChatChannel.send({
                type: 'broadcast',
                event: 'new-message', // El mismo que estén escuchando abajo.
                payload: {
                    id: this.messages.length + 1,
                    email: this.newMessage.email,
                    body: this.newMessage.body,
                    created_at: new Date(),
                }
            });
            console.log('Mensaje enviado: ', res);
            
            this.newMessage.body = "";
        }
    },
    async mounted() {
        // Definimos que se escuche el evento de emisión "new-message" (nombre arbitrario).
        globalChatChannel.on(
            'broadcast', // Esto es fijo para nuestro caso.
            {
                event: 'new-message', // Acá es lo que quieran.
            },
            data => {
                console.log("Data recibida en tiempo real: ", data);
                this.messages.push(data.payload);
            } // El callback para cada mensaje recibido.
        );
        // Nos suscribimos al canal.
        globalChatChannel.subscribe();
    }
}
</script>

<template>
    <MainH1>Chat global</MainH1>
    
    <div class="flex gap-4">
        <section class="w-9/12 min-h-100 p-4 border border-gray-400 rounded">
            <h2 class="sr-only">Lista de mensajes</h2>

            <ul class="flex flex-col gap-4">
                <!-- El prefijo "v-" indica que es una directiva. Una directa es una funcionalidad de Vue que extiende
                el HTML.
                El v-for repite la estructura de HTML por cada elemento del array que le pasamos.
                Siempre deberíamos agregar la propiedad "key" en conjunto con el v-for, asignándole un valor único de 
                los datos que recibimos.

                Otra directiva importante en Vue es "v-bind:" que se debe prefijar a cualquier otro atributo del elemento.
                Es de las más comunes de tener que utilizar, y es por eso que Vue tiene la abreviatura de solo el ":" como
                prefijo.
                Lo que hace es permitirnos usar como valor para el atributo un valor de JS (ya sea una expresión, 
                llamada a una función, acceso a un valor del componente, etc).
                -->
                <li
                    v-for="message in messages"
                    :key="message.id"
                    class="flex flex-col gap-0.5"
                >
                    <div><b>{{ message.email }}</b> dijo:</div>
                    <div>{{ message.body }}</div>
                    <div class="text-sm text-gray-600">{{ message.created_at }}</div>
                </li>
            </ul>
        </section>
        <section class="w-3/12">
            <h2 class="text-2xl mb-4">Enviar un mensaje</h2>

            <!-- 
            Para asociar un evento a un elemento del form podemos utilizar la directiva "v-on:" seguida del evento, o
            el shortcut "@evento".
            Como valor, se espera recibir una función con lo que queremos que se ejecute.
            Adicionalmente, nos permite agregar modificadores a los eventos, escribiendo ".modificador" a continuación
            del mismo.
            Los modificadores alteran o agregan alguna funcionalidad propia del evento.
            El más común es probablemente ".prevent" (que hace un preventDefault()).
            -->
            <form
                action="#"
                @submit.prevent="() => sendMessage()"
            >
                <div class="mb-4">
                    <label for="email" class="block mb-2">Email</label>
                    <!-- 
                    v-model es un shortcut que permite crear un "two-way data binding" entre un valor del state y un
                    control de formulario.
                    "Two-way data binding" es una práctica donde el framework se asegura de que la data del state y
                    del control del form estén sincronizados.
                    Dicho de otra forma, si cambio el valor del state, se actualiza el campo, y si cambio el valor del
                    campo, se actualiza el state.
                    -->
                    <input
                        type="email"
                        id="email"
                        class="w-full p-2 border border-gray-400 rounded"
                        v-model="newMessage.email"
                    >
                </div>
                <div class="mb-4">
                    <label for="body" class="block mb-2">Mensaje</label>
                    <textarea
                        id="body"
                        class="w-full p-2 border border-gray-400 rounded"
                        v-model="newMessage.body"
                    ></textarea>
                </div>
                <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Enviar</button>
            </form>
        </section>
    </div>
</template>