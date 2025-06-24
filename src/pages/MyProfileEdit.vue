<script setup>
import { onMounted, ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import useAuthUserState from '../composables/useAuthUserState';
import { updateAuthUserProfile } from '../services/auth';
import NotificationBox from '../components/NotificationBox.vue';

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
        title: null,
        closable: true,
    });

    async function handleSubmit() {
        feedback.value.message = null;

        try {
            // Si ya estamos actualizando, entonces no repetimos la acción.
            if(updating.value) return;

            updating.value = true;
            await updateAuthUserProfile({
                ...profile.value,
            });

            feedback.value = {
                ...feedback.value,
                type: 'success',
                title: 'Éxito',
                message: 'Tu perfil se actualizó con éxito.'
            }
        } catch (error) {
            feedback.value = {
                ...feedback.value,
                type: 'error',
                title: 'Error',
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