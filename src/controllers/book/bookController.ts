import { Request, Response, NextFunction } from "express";
import cloudinary from "../../config/cloudinary";
import path from "path";
import createHttpError from "http-errors";
import bookModel from "../../models/book/bookModel";

const createBook = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const {
        title,
        genre,
        author
    } = req.body;

    const files = req.files as { [filedName: string]: Express.Multer.File[] };

    // booleans to keep track of uploaded and non uploaded files
    let coverUploaded:boolean = false;
    let pdfUploaded: boolean = false;
    let uploadedToDb:boolean = false;

    let coverImageUrl:string='';
    let pdfUrl:string='';
    
    // cover image upload
    const coverImageMimeType = files.coverimage[0].mimetype.split('/').at(-1);
    const fileName = files.coverimage[0].filename;
    const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: 'book-covers',
            format: coverImageMimeType
        })
        if(uploadResult){
            coverUploaded=true;
            coverImageUrl=uploadResult.secure_url;
        }
    
        console.log('Book cover upload result', uploadResult);
    } catch (error) {
        return next(createHttpError(500, `Error while uploading cover image to cloudinary, ${error}`));
    }

    // pdf file upload
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);
    const bookPdfMimeType = files.file[0].mimetype.split('/').at(-1);

    try {
        const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: 'raw',
            filename_override: bookFileName,
            folder: 'book-pdfs',
            format: bookPdfMimeType
        })
        if(bookFileUploadResult){
            pdfUploaded=true;
            pdfUrl=bookFileUploadResult.secure_url;
        }

        console.log("Book file upload result", bookFileUploadResult);
        
    } catch (error) {
        return next(createHttpError(500, `There was an error uploading Book Pdf to cloudinary, ${error}`));
    }
    
    // Uploading data to mongodb database after media files have been uploaded
    if(pdfUploaded && coverUploaded){
        try {
            const newBook = await bookModel.create({
                title,
                genre,
                author: "661d4f36147950cf7a8c802f",
                coverImage: coverImageUrl,
                file: pdfUrl
            })
            if(newBook){
                console.log('Data uploaded to mongodb');
                uploadedToDb = true;
            }
        } catch (error) {
            next(createHttpError(500, `There was an error uploading data to mongodb, ${error}`));
        }
    }

    if(coverUploaded && pdfUploaded && uploadedToDb){
        res.json({message: 'Files uploaded and added to the database successfully'});
    } else {
        res.json({message: "There was a problem while uploading to the database or cloudinary"});
    }
}

export { createBook };