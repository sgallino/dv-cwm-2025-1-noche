/*
Symbol es un tipo de dato de JS que representa un valor único e irrepetible durante la ejecución del
programa.

Se crean llamando a la función Symbol().

Sirven para usarse como identificadores únicos en objetos o funciones.

Opcionalmente, pueden pasar una descripción como parámetro.
Esto solo sirve con fines de depuración.
*/
export const PROVIDE_GLOBAL_FEEDBACK_KEY = Symbol('global-feedback'); // Noten que no hay un "new", no estamos instanciando una clase.