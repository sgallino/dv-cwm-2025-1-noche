<script setup>
import { ref } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { register } from '../services/auth';
import MainButton from '../components/MainButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const { user, loading, handleSubmit } = useRegisterForm(router);

function useRegisterForm(router) {
    const user = ref({
        email: '',
        password: '',
    });
    const loading = ref(false);

    async function handleSubmit() {
        try {
            loading.value = true;
            await register(user.value.email, user.value.password);

            router.push('/mi-perfil');
        } catch (error) {
            // TODO: Manejar el error.
        }
        loading.value = false;
    }

    return {
        user,
        loading,
        handleSubmit,
    }
}
</script>

<template>
    <MainH1>Crear una nueva cuenta</MainH1>

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
            Crear cuenta
        </MainButton>
    </form>
</template>