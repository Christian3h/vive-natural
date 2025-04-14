import{crearCategoriaServices, crearSubCategoriaServices} from '../../services/api/categoriaServices.js'


export async function crearCategoria(req, res) {
    try {
        const resultado = await crearCategoriaServices(req)
        res.redirect('/sesion/admin/productos/')
       
    } catch (error) {
        console.log('Error al crear la categoria:', error);
        res.status(500).json({ 
            error: 'Error al crear la categoria', 
            detalle: error.message 
        });
    } 
}

export async function crearSubCategoria(req, res) {
    try {
        const resultado = await crearSubCategoriaServices(req)
        res.redirect('/sesion/admin/productos/')
        
    } catch (error) {
        console.log('Error al crear la subcategoria:', error);
        res.status(500).json({ 
            error: 'Error al crear la subcategoria', 
            detalle: error.message 
        });
    } 
}
