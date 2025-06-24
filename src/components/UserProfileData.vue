<script setup>
import { computed } from 'vue';
import NoImage from '/assets/no-image.jpg';

const props = defineProps({
    user: {
        type: Object,
    },
});

// Versión 1: Usando la ruta de "no-image" como string.
// const photoSrc = computed(() => props.user.photo || '/assets/no-image.jpg');

// Versión 2: Usando la imagen de "no-image" con un import.
const photoSrc = computed(() => props.user.photo || NoImage);
</script>

<template>
    <div class="flex gap-4">
        <div class="w-3/12 p-4 bg-slate-200">
            <div
                class="mb-4"
            >
                <img :src="photoSrc" alt="" class="rounded-[50%]">
            </div>
            <div class="ms-4 my-8 italic">{{ user.bio || 'Acá va mi biografía...' }}</div>
        </div>
        <div class="w-9/12 p-4">
            <dl>
                <dt class="mb-0.5 font-bold">Email</dt>
                <dd class="mb-4">{{ user.email }}</dd>
                <dt class="mb-0.5 font-bold">Nombre de Usuario</dt>
                <dd class="mb-4">{{ user.display_name || 'Sin especificar' }}</dd>
                <dt class="mb-0.5 font-bold">Carrera</dt>
                <dd class="mb-4">{{ user.career || 'Sin especificar' }}</dd>
            </dl>
        </div>
    </div>
</template>