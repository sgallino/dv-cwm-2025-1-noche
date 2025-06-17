<script setup>
import MainH1 from '../components/MainH1.vue';
import UserProfileData from '../components/UserProfileData.vue';
import useAuthUserState from '../composables/useAuthUserState';

const { user } = useAuthUserState();

// export default {
//     name: 'MyProfile',
//     components: { MainH1, },
//     data() {
//         return {
//             user: {
//                 id: null,
//                 email: null,
//                 display_name: null,
//                 bio: null,
//                 career: null,
//             },
//         }
//     },
//     mounted() {
//         unsubAuth = subscribeToUserState(newUserState => this.user = newUserState);
//     },
//     unmounted() {
//         unsubAuth();
//     }
// }
</script>

<template>
    <div class="flex gap-4 items-end">
        <MainH1>Mi perfil</MainH1>
        <RouterLink to="/mi-perfil/editar" class="mb-4 text-blue-700">Editar</RouterLink>
        <RouterLink to="/mi-perfil/editar/avatar" class="mb-4 text-blue-700">Editar imagen</RouterLink>
    </div>

    <UserProfileData :user="user" />
    <!-- <div class="flex gap-4">
        <div class="w-2/6 p-4 bg-slate-200">
            <div
                v-if="user.photo"
                class="mb-4"
            >
                <img :src="user.photo" alt="" class="rounded-[50%]">
            </div>
            <div class="ms-4 my-8 italic">{{ user.bio || 'Acá va mi biografía...' }}</div>
        </div>
        <div class="w-4/6 p-4">
            <dl>
                <dt class="mb-0.5 font-bold">Email</dt>
                <dd class="mb-4">{{ user.email }}</dd>
                <dt class="mb-0.5 font-bold">Nombre de Usuario</dt>
                <dd class="mb-4">{{ user.display_name || 'Sin especificar' }}</dd>
                <dt class="mb-0.5 font-bold">Carrera</dt>
                <dd class="mb-4">{{ user.career || 'Sin especificar' }}</dd>
            </dl>
        </div>
    </div> -->
</template>