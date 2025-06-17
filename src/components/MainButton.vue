<script setup>
import { computed } from 'vue';
import MainLoader from './MainLoader.vue';

// En la Composition API, si queremos indicar que este componente acepta propiedades, podemos hacerlo usando la "macro"
// defineProps().
// ¿Qué es una macro?
// Las macros no son funciones normales (por eso es que no hacemos un import de ellas), sino que son indicaciones para

// el compilador de Vue sobre transformaciones que debe realizar.
const props = defineProps({
    buttonStyle: {
        type: String,
        default: 'primary',
    },
    loading: {
        type: Boolean,
        default: false,
    }
});

// Necesitamos transformar el buttonStyle en un color equivalente para usar.
// Por ejemplo, podríamos usar una propiedad computada.
// Importante: Recuerden que para que Tailwind reconozca sus clases, es necesario que el nombre de la clase figure escrito
// entero, y no armado dinámicamente.
// Para más info: https://tailwindcss.com/docs/detecting-classes-in-source-files
const buttonColor = computed(() => {
    switch(props.buttonStyle) {
        case 'success':
            return 'bg-green-600 hover:bg-green-500 focus:bg-green-500 active:bg-green-700';

        case 'danger':
            return 'bg-red-600 hover:bg-red-500 focus:bg-red-500 active:bg-red-700';

        case 'secondary':
            return 'bg-gray-600 hover:bg-gray-500 focus:bg-gray-500 active:bg-gray-700';

        case 'primary':
        default:
            return 'bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700';
    }
});
</script>

<template>
    <button
        :class="`transition px-4 py-2 rounded ${buttonColor} text-white`"
    >
        <slot v-if="!loading">Enviar</slot>
        <MainLoader v-else />
    </button>
</template>