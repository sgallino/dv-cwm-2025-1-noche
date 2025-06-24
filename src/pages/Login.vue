<script setup>
import MainH1 from '../components/MainH1.vue';
import LoginForm from '../components/login/LoginForm.vue';

defineEmits(['feedbackChange']);
</script>

<template>
    <MainH1>Ingresar a mi cuenta</MainH1>

    <LoginForm
        @feedbackChange="newFeedback => $emit('feedbackChange', newFeedback)"
    />
</template>