import { Request, Response } from "express";
import { container } from "tsyringe";

import { ResetUserPasswordUseCase } from "./ResetUserPasswordUseCase";

class ResetUserPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { new_password } = request.body;

    const resetUserPassword = container.resolve(ResetUserPasswordUseCase);

    await resetUserPassword.execute({ token: String(token), new_password });

    return response.send();
  }
}

export { ResetUserPasswordController };
