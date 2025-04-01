import { createRouter, createWebHistory } from "vue-router";
// import Home from '../pages/Home.vue';

// Definimos la lista de rutas de nuestra aplicación.
const routes = [
    { path: '/',                component: () => import('../pages/Home.vue'), },
    { path: '/chat-global',     component: () => import('../pages/GlobalChat.vue'), },
    { path: '/ingresar',        component: () => import('../pages/Login.vue'), },
    { path: '/registro',        component: () => import('../pages/Register.vue'), },
];

// Creamos el router con createRouter.
// Esta función recibe un objeto de configuración que necesita tener 2 parámetros:
// 1. routes: la lista de rutas de nuestra aplicación.
// 2. history: el tipo de historial que queremos utilizar. Puede ser createWebHistory() o createWebHashHistory().
// createWebHistory() trabaja con URLs "comunes", donde el path se agrega al dominio. Requiere tener un servidor en Node.js
//  propiamente configurado para funcionar correctamente al refrescar la página.
//  Por ejemplo: http:///localhost:5173/chat-global
// createWebHashHistory() trabaja con URLs agregando un hash (#) para el path. Este modo funciona bien con el refresco
//  de la página, incluso sin un servidor en Node.js configurado.
//  Por ejemplo: http:///localhost:5173/#/chat-global
const router = createRouter({
    routes, // routes: routes
    history: createWebHistory(),
});

// Para terminar, exportamos el router.
export default router;