import supabase from "./supabase";

/**
 * 
 * @param {{id: string, email: string}} data 
 */
export async function createUserProfile(data) {
    const { error } = await supabase
        .from('user_profiles')
        .insert(data);

    if(error) {
        console.error('[user-profiles.js createUserProfile] Error al crear el perfil del usuario: ', error);
        throw error;
    }
}

/**
 * 
 * @param {string} id 
 * @param {{bio: string|null, career: string|null, display_name: string|null}} data 
 */
export async function updateUserProfile(id, data) {
    const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', id);

    if(error) {
        console.error('[user-profiles.js updateUserProfile] Error al actualizar el perfil del usuario: ', error);
        throw error;
    }
}

/**
 * 
 * @param {string} id 
 * @returns {{id: string, email: string, bio: string|null, career: string|null, display_name: string|null}}
 */
export async function getUserProfileById(id) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', id);

    if(error) {
        console.error('[user-profiles.js getUserProfileById] Error al traer el perfil del usuario: ', error);
        throw error;
    }

    // Como solo puede llegar una fila (filtramos por la PK), entonces hard-codeamos que queremos el primer (y único) registro.
    return data[0];
}