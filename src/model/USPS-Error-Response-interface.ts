export interface IUspsErrorSource {
  parameter?: string;
  example?: string
}
export interface IUspsError {
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: IUspsErrorSource;
}
export interface IUspsErrorResponseInterface {
  apiVersion?: string;
  error?: {
    code?: string;
    message?: string;
    errors?: IUspsError[];
  }
}