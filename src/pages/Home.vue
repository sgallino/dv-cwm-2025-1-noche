<script setup>
// El atributo "setup" del <script> indica que este componente usa la Composition API de Vue.
// Esto implica:
// - El compilador de Vue va a agregar automáticamente el "export default" del componente. No lo tenemos que (ni podemos)
//  exportarlo nosotros.
// - Todos los componentes que importemos pueden usarse directamente en el template. No necesitamos declararlos en ningún
//  objeto.
// - Todas las variables y funciones que definamos o importemos en el nivel superior del script están automáticamente
//  disponibles en el template.
import MainH1 from '../components/MainH1.vue';
</script>

<template>
    <MainH1>¡Les damos la bienvenida a DV Social!</MainH1>

    <p>DV Social es la mejor red para enterarte de todo lo que sucede en la Escuela, conectar con otras personas, como alumnos, profesores, etc.</p>
</template>