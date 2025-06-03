<script setup>
import { onMounted, ref, watch } from 'vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLoader from '../components/MainLoader.vue';
import { fetchLastPrivateChatMessages, sendPrivateChatMessage, subscribeToPrivateChatNewMessages } from '../services/private-chats';
import useAuthUserState from '../composables/useAuthUserState';
import useUserProfile from '../composables/useUserProfile';
import { useRoute } from 'vue-router';
import useScrollToBottom from '../composables/useScrollToBottom';

const route = useRoute();
const { user: userAuth } = useAuthUserState();
const { user: userChat, loading: loadingUser } = useUserProfile(route.params.id);
const { newMessage, sendMessage } = usePrivateChatForm(userAuth, userChat);
// const { messages, loading: loadingMessages } = usePrivateChatMessages(userAuth, route.params.id);
const { messages, loading: loadingMessages } = usePrivateChatMessages(userAuth, userChat);

function usePrivateChatMessages(userAuth, userChat) {
    const messages = ref([]);
    const loading = ref(false);
    const { moveScrollToBottom } = useScrollToBottom('chatContainer');

    onMounted(async () => {
        try {
            loading.value = true;
            messages.value = await fetchLastPrivateChatMessages(userAuth.value.id, userChat.value.id);
            loading.value = false;
            moveScrollToBottom();

            subscribeToPrivateChatNewMessages(userAuth.value.id, userChat.value.id, newMessage => {
                messages.value.push(newMessage);
                moveScrollToBottom();
            });
        } catch (error) {
            // TODO...
        }
        loading.value = false;

        // Si queremos asegurarnos de que solo se ejecute el código cuando se haya cargado el id del usuario, podemos
        // esperarlo con un watch().
        // watch(userChat, async (newUserChat, oldUserChat) => {
        //     if(newUserChat.id != null) {
        //         try {
        //             loading.value = true;
        //             messages.value = await fetchLastPrivateChatMessages(userAuth.value.id, userChat.value.id);
        //             loading.value = false;
        //             moveScrollToBottom();

        //             subscribeToPrivateChatNewMessages(userAuth.value.id, userChat.value.id, newMessage => {
        //                 messages.value.push(newMessage);
        //                 moveScrollToBottom();
        //             });
        //         } catch (error) {
        //             // TODO...
        //         }
        //         loading.value = false;
        //     }
        // });
    });

    return {
        messages,
        loading,
    }
}

function usePrivateChatForm(userAuth, userChat) {
    const newMessage = ref({
        body: '',
    });

    async function sendMessage() {
        try {
            sendPrivateChatMessage(userAuth.value.id, userChat.value.id, newMessage.value.body);
            newMessage.value.body = '';
        } catch (error) {
            // TODO...
        }
    }

    return {
        newMessage,
        sendMessage,
    }
}
</script>

<template>
    <template v-if="!loadingUser">
        <MainH1>Chat privado con {{ userChat.email }}</MainH1>

        <section 
            ref="chatContainer"
            class="overflow-y-auto h-100 p-4 mb-4 border border-gray-400 rounded"
        >
            <h2 class="sr-only">Lista de mensajes</h2>

            <ul 
                v-if="!loadingMessages"
                class="flex flex-col items-start gap-4"
            >
                <li
                    v-for="message in messages"
                    :key="message.id"
                    class="flex flex-col gap-0.5 max-w-8/12 p-4 rounded"
                    :class="{
                        'bg-gray-100': message.sender_id !== userAuth.id,
                        'self-end bg-green-200': message.sender_id === userAuth.id,
                    }"
                >
                    <div>{{ message.body }}</div>
                    <div class="text-sm text-gray-600">{{ message.created_at }}</div>
                </li>
            </ul>
            <div v-else class="flex justify-center items-center h-full">
                <MainLoader />
            </div>
        </section>
        <section>
            <h2 class="sr-only">Enviar un mensaje</h2>

            <form
                class="flex items-stretch gap-4"
                action="#"
                @submit.prevent="() => sendMessage()"
            >
                <div class="w-full">
                    <label for="body" class="sr-only">Mensaje</label>
                    <textarea
                        id="body"
                        class="w-full p-2 border border-gray-400 rounded"
                        v-model="newMessage.body"
                    ></textarea>
                </div>
                <MainButton>Enviar</MainButton>
            </form>
        </section>
    </template>
    <MainLoader v-else />
</template>