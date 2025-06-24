<script setup>
import { computed } from 'vue';
import checkIcon from '/icons/check.svg';
import crossIcon from '/icons/cross.svg';

const props = defineProps({
    content: {
        type: Object,
        required: true,
    }
});

defineEmits(['close']);

const ICONS_MAP = {
    'success': checkIcon,
    'error': crossIcon,
}

const icon = computed(() => ICONS_MAP[props.content.type] || null);

// const icon = computed(() => {
//     switch(props.content.type) {
//         case 'success':
//             return checkIcon;

//         case 'error':
//             return crossIcon;

//         default:
//             return null;
//     }
// });
</script>

<template>
    <div
        class="relative flex gap-4 p-4 mb-4 rounded"
        :class="{
            'bg-red-100 text-red-900': content.type === 'error',
            'bg-green-100 text-green-900': content.type === 'success',
        }"
    >
        <div
            v-if="icon"
            class="w-6"
        >
            <img :src="icon" alt="">
        </div>
        <div>
            <slot name="header" />
            <slot />
        </div>
        <button 
            v-if="content.closable"
            type="button"
            class="absolute top-2 right-2 w-12 h-12 text-2xl"
            @click="$emit('close')"
        >
            &times;
        </button>
    </div>
</template>