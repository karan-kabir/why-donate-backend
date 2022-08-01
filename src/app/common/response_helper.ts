import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import {
  GenericResponse,
  GenericResponseSuccess,
  PaginatedResponse,
  GenericErrorResponseFilter,
} from './generic';
import { v4 as uuid } from 'uuid';
export type AppResponses<T> =
  | GenericResponse<T>
  | GenericResponseSuccess
  | GenericErrorResponseFilter;

export function GenericSuccessResponse<T>(data: T): GenericResponse<T> {
  return {
    success: true,
    error: '',
    data: data,
  };
}

export function GenericSuccessPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  per_page: number,
  next: any,
  previous: any,
): GenericResponse<PaginatedResponse<T>> {
  return {
    success: true,
    error: '',
    data: {
      page: page,
      total: total,
      per_page: per_page,
      next: next,
      previous: previous,
      items: data,
    },
  };
}

export function GenericErrorResponse(
  error: string,
  message: any = null,
): GenericResponse<any> {
  return {
    success: false,
    error: error,
    data: message ?? {},
  };
}

export function GenericSuccessFilterResponse<T>(
  data: T,
  condition: boolean = false,
): AppResponses<T> {
  if (condition) {
    return {
      success: true,
      error: '',
      data: data,
    };
  } else {
    return {
      success: true,
    };
  }
}

export function GenericErrorFilterResponse(
  error: string,
  message: string = null,
  type: string = 'ERROR',
  condition: boolean = false,
): AppResponses<any> {
  if (condition) {
    return {
      success: false,
      error: error,
      data: message ?? {},
    };
  } else {
    return <GenericErrorResponseFilter>{
      server: process.env['SERVER_TAG'],
      errorMessage: error,
      errorType: type,
    };
  }
}

export function CreateErrorResponse(e: Error) {
  console.error(e);
  throw new HttpException(
    GenericErrorResponse(e.message),
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}

export function CreateErrorResponseHttpStatus(e: Error, http_status: any) {
  throw new HttpException(GenericErrorResponse(e.message), http_status);
}

export const multerOptionsS3 = {
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    console.log("mimetype",file.mimetype);
    
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF|EXE|exe|pdf|zip|mp4|csv|docx|xlsx|rar|x-msdownload)$/,)
    ) {
      // Allow storage of file
      cb(null, `${uuid()}${extname(file.originalname)}`);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};

export async function formatBytes(bytes, decimals = 2) {
  try {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  } catch (error) {
    console.log(error);
  }
}
