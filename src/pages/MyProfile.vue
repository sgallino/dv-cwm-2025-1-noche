<script>
import MainH1 from '../components/MainH1.vue';
import { subscribeToUserState } from '../services/auth';

export default {
    name: 'MyProfile',
    components: { MainH1, },
    data() {
        return {
            user: {
                id: null,
                email: null,
                display_name: null,
                bio: null,
                career: null,
            },
        }
    },
    mounted() {
        subscribeToUserState(newUserState => this.user = newUserState);
    }
}
</script>

<template>
    <MainH1>Mi perfil</MainH1>

    <div class="ms-4 my-8 italic">{{ user.bio }}</div>

    <dl>
        <dt class="mb-0.5 font-bold">Email</dt>
        <dd class="mb-4">{{ user.email }}</dd>
        <dt class="mb-0.5 font-bold">Nombre de Usuario</dt>
        <dd class="mb-4">{{ user.display_name }}</dd>
        <dt class="mb-0.5 font-bold">Carrera</dt>
        <dd class="mb-4">{{ user.career }}</dd>
    </dl>
</template>