<script setup>
import { useRoute } from 'vue-router';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import useUserProfile from '../composables/useUserProfile';

/*
Si necesitamos usar datos del Router o el Route, que antes obteníamos como this.$router y this.$route, respectivamente,
tenemos que usar los "composables" que vue-router nos ofrece: useRouter() y useRoute().
*/
const route = useRoute();
const { user, loading } = useUserProfile(route.params.id);

/*export default {
    name: 'UserProfile',
    components: { MainH1, MainLoader },
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
            loading: false,
        }
    },
    async mounted() {
        try {
            this.loading = true;
            // Recapitulando: Cuando usamos Vue Router con la Options API, se nos generan automáticamente 2 variables:
            // $router y $route.
            // Contienen la referencia al objeto del Router y al objeto de la ruta en la que estamos, respectivamente.
            this.user = await getUserProfileById(this.$route.params.id);
            this.loading = false;
        } catch (error) {
            // TODO...
        }
    },
}*/
</script>

<template>
    <template v-if="!loading">
        <MainH1>Perfil de {{ user.email }}</MainH1>

        <div class="ms-4 my-8 italic">{{ user.bio || 'Acá va mi biografía...' }}</div>

        <dl class="mb-4">
            <dt class="mb-0.5 font-bold">Email</dt>
            <dd class="mb-4">{{ user.email }}</dd>
            <dt class="mb-0.5 font-bold">Nombre de Usuario</dt>
            <dd class="mb-4">{{ user.display_name || 'Sin especificar' }}</dd>
            <dt class="mb-0.5 font-bold">Carrera</dt>
            <dd class="mb-4">{{ user.career || 'Sin especificar' }}</dd>
        </dl>

        <hr class="mb-4">

        <RouterLink 
            :to="`/usuario/${user.id}/chat`"
            class="text-blue-700"
        >Iniciar conversación privada con {{ user.email }}</RouterLink>
    </template>
    <MainLoader v-else />
</template>