import { v2 as cloudinary} from 'cloudinary';
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_API_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })
        
        fs.unlink(localFilePath, (err) => {
            if (err) { 
                console.error(err);
                return;
            }
        })
        return response;
    
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.error(error);
        return null
    }
}

const deleteImageFromCloudinary = async (imageUrl)=>{
    try {
        if(!imageUrl) return false; 
        const publicId = getCloudinaryPublicId(imageUrl);
        const response = await cloudinary.uploader.destroy(publicId)
        
        return response.result == "ok" ?  true : false

    } catch (error) {
        console.error("Failed image deletion from cloudinary " ,error?.message);
        return false;
    }
}

const getCloudinaryPublicId = ( url ) => {
    return url.slice(30).split(".")[0].slice(-20)
}



export {uploadOnCloudinary , deleteImageFromCloudinary, getCloudinaryPublicId}