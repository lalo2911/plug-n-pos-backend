import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products', // Carpeta donde se guardarán las imágenes
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Formatos permitidos
        transformation: [
            {
                width: 500,
                height: 500,
                crop: 'fill',
                quality: 'auto',
                format: 'webp' // Convertir a WebP para mejor optimización
            }
        ],
        public_id: (req, file) => {
            // Generar un ID único para el archivo
            const timestamp = Date.now();
            const random = Math.round(Math.random() * 1E9);
            return `product_${timestamp}_${random}`;
        }
    },
});

// Configurar multer
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
    },
    fileFilter: (req, file, cb) => {
        // Verificar que sea una imagen
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    }
});

// Función para eliminar imagen de Cloudinary
export const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        throw error;
    }
};

export default cloudinary;