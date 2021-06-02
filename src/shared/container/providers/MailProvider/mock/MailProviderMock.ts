import { IMailProvider, ISendMailDTO } from "../IMailProvider";

class MailProviderMock implements IMailProvider {
  private messages: any[];

  constructor() {
    this.messages = [];
  }

  async sendMail({
    to,
    subject,
    path,
    variables,
  }: ISendMailDTO): Promise<void> {
    this.messages.push({ to, subject, path, variables });
  }
}

export { MailProviderMock };
