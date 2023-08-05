import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import keys from '../configs/keys.js';

const { baseUrl, dir: imageDir, targetWidth } = keys.img;

const createAndResizeImage = async (imgName, base64payload) => {
    try {
        // Create the image from the base64 payload
        const imageBuffer = Buffer.from(base64payload, 'base64');
        const originalImagePath = path.join(imageDir, imgName);

        await fs.promises.writeFile(originalImagePath, imageBuffer);
        const resizedImageName = await resize(originalImagePath, imageDir, targetWidth);

        // Remove the original image
        await fs.promises.unlink(originalImagePath);

        console.log('Image created, resized, and original removed');
        return baseUrl + resizedImageName;
    } catch (error) {
        throw error;
    }
};

const resize = async (originalImagePath, outputDir, targetWidth) => {
    try {

        // Calculate target height while maintaining aspect ratio
        const imageInfo = await sharp(originalImagePath).metadata();
        const aspectRatio = imageInfo.width / imageInfo.height;
        const targetHeight = Math.round(targetWidth / aspectRatio);

        // Generate a UID for the resized image name
        const uid = uuidv4();
        const resizedImgName = uid + path.extname(originalImagePath);

        // Resize the image
        const resizedImagePath = path.join(outputDir, resizedImgName);
        await sharp(originalImagePath)
            .resize(targetWidth, targetHeight)
            .toFile(resizedImagePath);
        return resizedImgName;
    } catch (error) {
        throw error;
    }
};

export { resize, createAndResizeImage };