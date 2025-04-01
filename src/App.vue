<script>
// Acá va la lógica del componente.
// En los componentes que usan la Options API, debemos exportar como default un objeto con la configuración del componente.
// Si queremos usar otros componentes, es necesario importarlos.
// En la Options API, es necesario también declarar los componentes que vamos a usar.
// Una vez importado correctamente, podemos usarlo en el template con la sintaxis <Componente></Componente> o
// <Componente />.
// import Home from './pages/Home.vue';

export default {
    // El "name" define el nombre del componente. Es opcional.
    // Se supone que sea igual que el nombre del archivo.
    name: 'App',
    // "components" recibe un objeto donde define los componentes que se van a usar en el <template>.
    // components: { Home },
}
</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">DV Social</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Mostrar u ocultar navegación">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <!-- <router-link class="nav-link" to="/">Home</router-link> -->
                        <RouterLink class="nav-link" to="/">Home</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/chat-global">Chat Global</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/ingresar">Iniciar Sesión</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/registro">Registrarse</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container py-4">
        <!-- <router-view /> -->
        <RouterView />
    </div>
    <footer class="footer">
        <p>Da Vinci &copy; 2025</p>
    </footer>
</template>

<style scoped>
/* Acá podemos poner los estilos que son específicos para este componente.
Si queremos asegurarnos que los estilos acá indicados solo afecten a *este* componente, debemos agregar el atributo
"scoped" a <style>. */
.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background-color: #333;
    color: #fff;
}

.footer p {
    margin: 0;
}
</style>