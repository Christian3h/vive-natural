import { crearCategoriaModels, crearSubCategoriaModels } from '../../models/categoriaModels.js'


export async function crearCategoriaServices(req) {
    const categoria = req.body.categoria
    try {
        const categoriaCreada = await crearCategoriaModels(categoria);
        return categoriaCreada
    } catch (error) {
        console.log('Error al crear la categoria:', error);
        res.status(500).json({ 
            error: 'Error al crear la categoria', 
            detalle: error.message 
        });
    } 
}


export async function crearSubCategoriaServices(req) {
    const subCategoriaV = req.body.subCategoria;
    const id_categoria = req.body.categoria;
    try {
        const subcategoria = await crearSubCategoriaModels(subCategoriaV, id_categoria);
        return subcategoria
    } catch (error) {
        console.log('Error al crear la subcategoria:', error);
        res.status(500).json({ 
            error: 'Error al crear la subcategoria', 
            detalle: error.message 
        });
    } 
}
