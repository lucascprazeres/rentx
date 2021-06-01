export interface ISendMailDTO {
  to: string;
  subject: string;
  variables: any;
  path: string;
}

interface IMailProvider {
  sendMail(request: ISendMailDTO): Promise<void>;
}

export { IMailProvider };
