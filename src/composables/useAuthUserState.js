import { onMounted, onUnmounted, ref } from "vue";
import { subscribeToUserState } from "../services/auth";

/**
 * Obtiene los datos del usuario autenticado (o no autenticado).
 * 
 * @returns {{id: null|string, email: null|string, bio: null|string, display_name: null|string, career: null|string}}
 */
export default function useAuthUserState() {
    let unsubAuth = () => {};

    const user = ref({
        id: null,
        email: null,
        bio: null,
        display_name: null,
        career: null,
    });

    onMounted(() => unsubAuth = subscribeToUserState(newUserState => user.value = newUserState));
    // onUnmounted(() => unsubAuth());
    onUnmounted(unsubAuth);

    return {
        user,
    }
}