<script setup>
import { onMounted, ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import useAuthUserState from '../composables/useAuthUserState';
import { updateAuthUserProfile } from '../services/auth';

const { user } = useAuthUserState();
const { profile, updating, feedback, handleSubmit } = useProfileEditForm(user);

function useProfileEditForm(user) {
    const profile = ref({
        display_name: '',
        bio: '',
        career: '',
    });
    const updating = ref(false);
    const feedback = ref({
        type: 'success',
        message: null,
    });

    async function handleSubmit() {
        feedback.message = null;

        try {
            // Si ya estamos actualizando, entonces no repetimos la acción.
            if(updating.value) return;

            updating.value = true;
            await updateAuthUserProfile({
                ...profile.value,
            });

            feedback.value = {
                type: 'success',
                message: 'Tu perfil se actualizó con éxito.'
            }
        } catch (error) {
            feedback.value = {
                type: 'error',
                message: 'Ocurrió un error al actualizar el perfil.',
            }
        }
        updating.value = false;
    }

    onMounted(() => {
        profile.value = {
            bio: user.value.bio,
            display_name: user.value.display_name,
            career: user.value.career,
        }
    });

    return {
        profile,
        updating,
        feedback,
        handleSubmit,
    }
}
</script>

<template>
    <MainH1>Editar mi perfil</MainH1>

    <div
        v-if="feedback.message != null"
        class="p-4 mb-4 rounded"
        :class="{
            'bg-red-100 text-red-700': feedback.type === 'error',
            'bg-green-100 text-green-700': feedback.type === 'success',
        }"
    >
        {{ feedback.message }}
    </div>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="bio" class="block mb-2">Biografía</label>
            <textarea
                id="bio"
                class="w-full p-2 border border-gray-400 rounded"
                v-model="profile.bio"
            ></textarea>
        </div>
        <div class="mb-4">
            <label for="display_name" class="block mb-2">Nombre de usuario</label>
            <input
                type="text"
                id="display_name"
                class="w-full p-2 border border-gray-400 rounded"
                v-model="profile.display_name"
            >
        </div>
        <div class="mb-4">
            <label for="career" class="block mb-2">Carrera</label>
            <input
                type="text"
                id="career"
                class="w-full p-2 border border-gray-400 rounded"
                v-model="profile.career"
            >
        </div>
        <MainButton type="submit">
            <!-- {{ !updating ? 'Actualizar' : 'Cargando...' }} -->
            <template v-if="!updating">Actualizar</template>
            <MainLoader v-else /> 
        </MainButton>
    </form>
</template>