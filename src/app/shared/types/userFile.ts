import { NoeFileType } from "./noeFile";

export interface UserFileType {
    _id?: string;
    mimetype?: string;
    noeFile?: NoeFileType;
    uploadDate?: string;
    filename?: string;
    encoding?: string;
    md5?: string;
    originalname?: string;
    size?: number;
}
