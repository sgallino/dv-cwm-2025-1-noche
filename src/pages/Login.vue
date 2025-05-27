<script setup>
import { ref } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { login } from '../services/auth';

// En la Composition API, la forma recomendada de trabajo es encapsular cada responsabilidad lógica de nuestro
// componente en una función, que luego invocamos.
// Esta función, por convención, lleva el prefijo "use".
// Además, cualquier dependencia que la función tenga que no sea parte de lo que la propia función declara, debería
// recibirse como argumento. Y, finalmente, debería retornar los valores que queremos que queden expuestos para su uso.
// ¿Por qué se recomienda esta manera?
// - Encapsular la lógica en una función evita la contaminación (pollution) del espacio raíz de variables.
// - Como queda encapsulada la lógica en la función, solo necesitamos leer esa función para entender cómo se resuelve
//  la responsabilidad.
// - Facilita la lectura del componente. Tenemos al comienzo una lista de las llamadas a los composables de cada 
//  responsabilidad. Esto hace que sea muy sencillo entender qué responsabilidades abarca el componente.
// - Si luego ocurre que necesitamos usar esta misma lógica en otro componente, se vuelve una trivial extraer la función
//  a un archivo externo que la exporte, y luego importarla en todos los componentes que la necesiten.
const { user, loading, handleSubmit } = useLoginForm();

// Para crear variables "reactivas" (como las del "data()" de la Options API) podemos que usar la función ref().
// Esta función recibe un valor cualquiera (string, number, object, array, etc) y nos retorna un objeto que envuelve
// a ese valor en su propiedad "value".
// Pueden tener tantos refs como quieran. Una buena guía de base es que cada propiedad que tendrían en el data() sería
// su propio ref.
function useLoginForm() {
    const user = ref({
        email: '',
        password: '',
    });
    const loading = ref(false);

    // Para lo que son las funciones dentro de "methods", simplemente definimos la función normalmente.
    async function handleSubmit() {
        try {
            // Noten que para poder acceder al valor del ref tenemos que hacerlo a través de la propiedad ".value".
            // Pueden pensarlo como la versión en la Composition API del "this." de las propiedades de la Options API.
            loading.value = true;
            await login(user.value.email, user.value.password);
        } catch (error) {
            // TODO: Manejar
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        handleSubmit,
    }
}
/*export default {
    name: 'Login',
    components: { MainH1 },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
        }
    },
    methods: {
        async handleSubmit() {
            try {
                this.loading = true;
                const user = await login(this.user.email, this.user.password);
                this.loading = false;

                // Emitimos un evento "login" con los datos del usuario que se autenticó.
                // De esta forma, cualquier elemento contenedor (como App) va a poder escuchar ese evento y recibir los 
                // datos.
                // this.$emit('login', {id: this.user.id, email: this.user.email});
            } catch (error) {
                // TODO: Manejar
            }
        }
    }
}*/
</script>

<template>
    <MainH1>Ingresar a mi cuenta</MainH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="email" class="block mb-2">Email</label>
            <input
                type="email"
                id="email"
                class="w-full p-2 border border-gray-400 rounded"
                v-model="user.email"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-2">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-full p-2 border border-gray-400 rounded"
                v-model="user.password"
            >
        </div>
        <button type="submit" class="transition px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white">Ingresar</button>
    </form>
</template>