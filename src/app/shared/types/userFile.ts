import { NoeFileType } from "./noeFile";

export interface UserFileType {
    _id?: string;
    filename?: string;
    encoding?: string;
    md5?: string;
    mimetype?: string;
    originalname?: string;
    size?: number;
    uploadDate?: string;
    noeFile?: NoeFileType;
}
