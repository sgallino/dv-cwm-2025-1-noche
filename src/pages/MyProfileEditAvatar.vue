<script setup>
import { onUnmounted, ref } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import { updateAuthUserAvatar } from '../services/auth';
import MainLoader from '../components/MainLoader.vue';

const { avatar, updating, handleSubmit, handleFileChange } = useAvatarUploadForm();

function useAvatarUploadForm() {
    const avatar = ref({
        file: null,         // El objeto File con el archivo.
        objectURL: null,    // El objeto ObjectURL que contiene el contenido para mostrar en un <img> local.
    });
    const updating = ref(false);

    async function handleSubmit() {
        try {
            // Si no hay archivo, o estamos actualizándolo, no hacemos nada.
            if(!avatar.value.file) return;
            if(updating.value) return;

            try {
                updating.value = true;
                await updateAuthUserAvatar(avatar.value.file);
            } catch (error) {
                // TODO...
            }
            updating.value = false;
        } catch (error) {
            
        }
    }

    async function handleFileChange(event) {
        // En los inputs de tipo "file" hay una propiedad "files". Contiene un FileList (en esencia, un array de objetos
        // File).
        // File es la clase nativa de JS que representa un archivo.
        // Como nuestro input "file" no tiene la propiedad "multiple" y, por extensión, no soporta elegir múltiples
        // archivos, entonces podemos hard-codear la lectura de la posición 0 del array.
        const selectedFile = event.target.files[0];

        // console.log("Archivos del input: ", event.target.files);
        // console.log("El archivo seleccionado: ", selectedFile);

        // Si no hay un archivo, no hacemos nada.
        if(!selectedFile) return;

        avatar.value.file = selectedFile;

        // Preguntamos si hay un ObjectURL viejo ya creado, en cuyo caso lo "revocamos" (eliminamos).
        if(avatar.value.objectURL) {
            URL.revokeObjectURL(avatar.value.objectURL);
        }

        // Creamos el "ObjectURL" para poder previsualizar con la <img> la seleccionada por el usuario.
        // ¿Qué es, exactamente, un "ObjectURL"?
        // Un ObjectURL es un objeto que contiene una referencia a un recurso en la memoria de la PC, y que permite
        // poder acceder a ese recurso a través de una URL local.
        // Cuando el usuario selecciona una imagen en un input "file", esa se levanta en memoria, y queda asociada en
        // este caso a nuestro ObjectURL.
        // Por su parte, los ObjectURL (con su referencia y su URL) quedan asociados al "document" de la página.
        // Es decir, hasta que no salgamos o refresquemos la página, los ObjectURL no se eliminan por sí solos, ni
        // tampoco se libera la memoria del recurso referenciado por este objeto.
        // En sitios "multi-page" (como le dicen ahora a las sitios web tradicionales) esto no supone un mayor 
        // inconveniente.
        // Sin embargo, en SPAs, particularmente las que pueden estar mucho tiempo cargadas, esto sí es un problema.
        // Si no liberamos la memoria, con el correr del tiempo, vamos a ir teniendo una mayor "memory leak".
        // Razón por la cual es absolutamente clave asegurarnos de limpiar los ObjectURLs manualmente cuando ya no
        // sea necesarios. La forma de hacerlo es a través de la función URL.revokeObjectURL().
        avatar.value.objectURL = URL.createObjectURL(avatar.value.file);
    }

    onUnmounted(() => avatar.value ? URL.revokeObjectURL(avatar.value) : '');

    return {
        avatar,
        updating,
        handleSubmit,
        handleFileChange,
    }
}
</script>

<template>
    <MainH1>Editar mi imagen de perfil</MainH1>

    <form 
        action="#"
        class="flex gap-4 mb-4"
        @submit.prevent="handleSubmit"
    >
        <div class="w-1/2">
            <div class="mb-4">
                <label for="avatar" class="block mb-2">Nueva imagen de perfil</label>
                <!-- 
                En los inputs de tipo file no se puede usar el v-model.
                Esto es porque el v-model crea un "two-way data binding". Es decir, que el valor de la referencia reactiva
                de Vue se vuelve la "única fuente de verdad" (single source of truth). Vue automáticamente actualiza el
                contenido del control del formulario con el valor de la referencia, y si se cambia el valor del control,
                entonces Vue actualiza la referencia.
                Los inputs de tipo file *no pueden ser asignados un valor programáticamente*.

                En su lugar, tenemos que manejarlo de manera más "tradicional" usando un evento "change".
                -->
                <input
                    type="file"
                    id="avatar"
                    class="w-full p-2 border border-gray-400 rounded"
                    @change="handleFileChange"
                >
            </div>
            <MainButton
                :loading="updating"
                type="submit"
            >
                Subir imagen
            </MainButton>
        </div>
        <div class="w-1/2">
            <!-- Acá va el preview -->
            <img
                v-if="avatar.objectURL"
                :src="avatar.objectURL"
                alt=""
            >
        </div>
    </form>
</template>