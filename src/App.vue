<script setup>
import { useRouter } from 'vue-router';
import { logout } from './services/auth';
import useAuthUserState from './composables/useAuthUserState';
import { provide, readonly, ref } from 'vue';
import NotificationBox from './components/NotificationBox.vue';
import { PROVIDE_GLOBAL_FEEDBACK_KEY } from './symbols/provide-keys';

const router = useRouter();
const { user } = useAuthUserState();
const { handleLogout } = useLogout(router);

function useLogout(router) {
    function handleLogout() {
        logout();
        router.push('/ingresar');
    }

    return {
        handleLogout,
    }
}

/*
# Maneras de manejar la data para la notificación global
Ahora que tenemos nuestra notificación global acá en App, necesitamos darle alguna manera a los
componentes descendientes la posibilidad de especificar el contenido para este feedback.
Hay diferentes maneras de encararlo, cada una con sus pros y contras.

## Usando emisión de eventos
    Podemos hacer que el RouterView acepte un evento "feedbackChange" que permita recibir los
    nuevos valores para el feedback.
    Pros:
        - No requiere ninguna estructura específica de componentes.
        - Los componentes no tienen dependencias, por lo que son altamente reutilizables.
        - Es muy fácil de implementar.
    
    Contras:
        - Puede ser bastante engorroso de implementar. Especialmente si tenemos varios componentes
            anidados entre el componente que tiene el feedback y el componente que lo necesita
            modificar.
        - Esta solución es un poco "sucia", en el sentido de que RouterView queda escuchando 
            siempre un evento que, posiblemente, casi ninguna vista vaya a utilizar.

## Usando provide / inject
    Vue incluye una API llamada "provide / inject" que nos permite compartir valores entre
        componentes que sean descendientes o ascendentes, sin necesitar pasar a mano los
        datos.
    Pros:
        - Al ser una API nativa de Vue, es muy simple de implementar.
        - Además, es fácil también de entender para cualquier desarrollador de Vue.
        - No requiere ningún pasaje de datos entre componentes. La comunicación es directa.
    
    Contras:
        - Crea una dependencia directa entre los componentes que proveen la dependencia y los
            que la utilizan. Esto limita la capacidad de reutilización de los componentes.
        - Puede ser complicado tener presente qué dependencias están disponibles en un 
            componente para poder inyectar.
*/

const feedback = ref({
    type: 'success',
    title: null,
    message: null,
    closable: true,
});

function updateFeedback(newFeedback) {
    feedback.value = {
        ...feedback.value,
        // ...newFeedback,
        message: newFeedback.message,
        title: newFeedback.title,
        type: newFeedback.type,
    }
}

// # Feedback global: Versión con provide / inject
// Como vemos, con provide podemos pasar cualquier dato que queramos, incluyendo una referencia
//  reactiva.
// Que podamos hacer eso no significa que sea una buena idea. De hecho, no lo es.
// Pasar la referencia reactiva directamente permite que cualquier componente que inyecte este
//  valor lo pueda mutar libremente.
// Y si bien uno puede argumentar que la idea en este caso es que los componentes descendientes
//  puedan mutar el mensaje, que puedan hacerlo con total impunidad es un problema.
// No hay forma, haciéndolo así, de asegurarnos que los datos que le asignen a "feedback" sean
//  los que yo espero. Y no que modifiquen de manera inservible el valor.
// Es una mucha mejor alternativa enviar funciones que permitan modificar los datos. De esta
//  forma, la data queda protegida, y la función puede agregar cualquier validación o restricción
//  necesaria para garantizar el correcto funcionamiento.
// La idea es muy similar a lo que ya conocen de programación orientada a objetos con el
//  encapsulamiento y los setters y getters.
// Si queremos mandar los datos de una referencia reactiva, generalmente se recomienda enviar
//  una copia de solo lectura del valor. Vue cuenta con una función llamada "readonly" que 
//  podemos usar para este fin.
provide(PROVIDE_GLOBAL_FEEDBACK_KEY, {
    // feedback: readonly(feedback),
    updateFeedback,
});
</script>

<template>
    <!-- 
    Tailwind sigue, en general, algunas convenciones para sus estilos.
    - Para algunos estilos que tienen una lista posible de valores ya pre-definidos (y que no colisionan con valores de
    otros estilos), Tailwind utiliza como nombre de la clase el valor del estilo. Por ejemplo, los display.
        Si queremos:
            display: flex;                  => flex
            display: inline-block;          => inline-block
            display: grid;                  => grid
    - Para la mayoría de los estilos, Tailwind utiliza el formato de: estilo-valor
    El valor puede ser una keyword, en el caso de estilos que así lo requieren (como "justify-contents"), o puede
    ser una medida (como en "font-size"), o podrá ser algún otro tipo de valor (como para colores).
    Por ejemplo, clases como "justify-contents", "gap", "margin", "background-color", etc.
        Si queremos:
            margin: 1rem;                   => m-4
            padding-top: .5rem;             => pt-2
            background-color: white;        => bg-white
    Lo que pueden ir notando, es que para la mayoría de los estilos que aceptan una dimensión (número más unidad de 
    medida), aceptan una serie de posibles valores, empezando por un número que es el múltiplo de 4 que queremos aplicar,
    o dicho de otra forma, el múltiplo de .25rem que queremos aplicar.
    -->
    <nav class="flex items-center gap-8 p-4 bg-slate-300">
        <!-- 
        Las clases para los estilos de tamaño de tipografía son un poco arbitrarios. No siguen la escala previamente
        mencionada.
        -->
        <RouterLink class="text-lg" to="/">DV Social</RouterLink>
        <ul class="flex gap-4">
            <li>
                <!-- <router-link to="/">Home</router-link> -->
                <RouterLink to="/">Home</RouterLink>
            </li>
            <template v-if="user.id !== null">
                <li>
                    <RouterLink to="/chat-global">Chat global</RouterLink>
                </li>
                <li>
                    <RouterLink to="/mi-perfil">Mi perfil</RouterLink>
                </li>
                <li>
                    <form 
                        action="#"
                        @submit.prevent="handleLogout"
                    >
                        <button type="submit">{{ user.email }} (cerrar sesión)</button>
                    </form>
                </li>
            </template>
            <template v-else>
                <li>
                    <RouterLink to="/ingresar">Iniciar sesión</RouterLink>
                </li>
                <li >
                    <RouterLink to="/registro">Registrarse</RouterLink>
                </li>
            </template>
        </ul>
    </nav>
    <div class="container mx-auto p-4">
        <!-- Notificaciones globales -->
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

        <!-- # Feedback global: Versión usando emisión de eventos -->
        <RouterView 
            @feedbackChange="updateFeedback"
        />
    </div>
    <footer class="flex justify-center items-center h-25 bg-slate-900 text-white">
        <p>Da Vinci &copy; 2025</p>
    </footer>
</template>