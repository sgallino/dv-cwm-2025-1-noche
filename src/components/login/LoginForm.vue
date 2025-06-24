<script setup>
import { inject, ref } from 'vue';
import { login } from '../../services/auth';
import MainButton from '../../components/MainButton.vue';
import { useRouter } from 'vue-router';
import NotificationBox from '../../components/NotificationBox.vue';
import { PROVIDE_GLOBAL_FEEDBACK_KEY } from '../../symbols/provide-keys';

// # Feedback global: Versión con emisión de eventos.
const emit = defineEmits(['feedbackChange']);

const router = useRouter();

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
const { user, loading, feedback, handleSubmit } = useLoginForm(router);

// # Feedback global: Versión usando provide / inject
const { updateFeedback: updateGlobalFeedback } = inject(PROVIDE_GLOBAL_FEEDBACK_KEY);

// Para crear variables "reactivas" (como las del "data()" de la Options API) podemos que usar la función ref().
// Esta función recibe un valor cualquiera (string, number, object, array, etc) y nos retorna un objeto que envuelve
// a ese valor en su propiedad "value".
// Pueden tener tantos refs como quieran. Una buena guía de base es que cada propiedad que tendrían en el data() sería
// su propio ref.
function useLoginForm(router) {
    const user = ref({
        email: '',
        password: '',
    });
    const loading = ref(false);
    const feedback = ref({
        type: 'success',
        message: null,
        title: null,
    });

    // Para lo que son las funciones dentro de "methods", simplemente definimos la función normalmente.
    async function handleSubmit() {
        try {
            feedback.value.message = null;

            // Noten que para poder acceder al valor del ref tenemos que hacerlo a través de la propiedad ".value".
            // Pueden pensarlo como la versión en la Composition API del "this." de las propiedades de la Options API.
            loading.value = true;
            await login(user.value.email, user.value.password);
            
            // # Feedback global: Versión usando provide / inject
            updateGlobalFeedback({
                type: 'success',
                message: `¡Hola de nuevo, ${user.value.displayName || user.value.email}!`,
                title: 'Éxito',
            });
            // globalFeedback.value = {
            //     ...globalFeedback.value,
            //     type: 'success',
            //     message: `¡Hola de nuevo, ${user.value.displayName || user.value.email}!`,
            //     title: 'Éxito',
            // }
            
            // # Feedback global: Versión con emisión de eventos.
            // emit('feedbackChange', {
            //     type: 'success',
            //     message: `¡Hola de nuevo, ${user.value.displayName || user.value.email}!`,
            //     title: 'Éxito',
            // });
            // feedback.value = {
            //     ...feedback.value,
            //     type: 'success',
            //     message: `¡Hola de nuevo, ${user.value.displayName || user.value.email}!`,
            //     title: 'Éxito',
            // }

            router.push('/mi-perfil');
        } catch (error) {
            feedback.value = {
                ...feedback.value,
                type: 'error',
                message: 'Las credenciales ingresadas no coinciden con nuestros registros.',
                title: 'Error',
            }
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        feedback,
        handleSubmit,
    }
}
</script>

<template>
    <NotificationBox
        v-if="feedback.message != null"
        :content="feedback"
        @close="() => feedback.message = null"
    >
        <template
            v-if="feedback.title"
            v-slot:header
        >
            <h2 class="text-xl pb-2 mb-4 border-b">{{ feedback.title }}</h2>
        </template>

        {{ feedback.message }}
    </NotificationBox>

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
        <MainButton
            :loading="loading"
            type="submit"
        >
            Ingresar
        </MainButton>
    </form>
</template>