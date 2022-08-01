export class ServerInfo {
  public server : string;
  public timestamp : Date;
  public version : string;
}

export class GenericResponse<D> {
  public success: boolean;
  public error: string;
  public data: D;
}

export class GenericResponseReturn<D> {
  public data: D;
}

export class PaginatedResponse<I> {
  public page: number;
  public total: number;
  public per_page: number;
  public next: number;
  public previous: number;
  public items: I[];
}

export class GenericResponseSuccess{
  public success : boolean;
}

export class GenericErrorResponseFilter{
  public errorMessage : string;
  public errorType : string;
  public server : string;
}