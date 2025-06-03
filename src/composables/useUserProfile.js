import { onMounted, ref } from "vue";
import { getUserProfileById } from "../services/user-profiles";

/**
 * 
 * @param id {string}
 */
export default function useUserProfile(id) {
    const user = ref({
        id,
        // id: null,
        email: null,
        bio: null,
        display_name: null,
        career: null,
    });
    const loading = ref(false);

    /*
    Para acceder a los "hooks" del ciclo de vida de Vue (como mounted o unmounted) podemos utilizar las funciones que se 
    llaman de la misma forma, pero con el prefijo "on". Por ejemplo, onMounted().
    El código que queremos asociar lo pasamos dentro de un closure como argumento de la función.
    */
    onMounted(async () => {
        try {
            loading.value = true;
            user.value = await getUserProfileById(id);
            loading.value = false;
        } catch (error) {
            // TODO...
        }
    });

    return {
        user,
        loading,
    }
}