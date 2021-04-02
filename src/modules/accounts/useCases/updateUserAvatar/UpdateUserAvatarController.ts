import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateUserAvatarUseCase } from "./UpdateUserAvatarUseCase";

export class UpdateUserAvatarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const avatar_file = request.file.filename;

    const updateUserAvatar = container.resolve(UpdateUserAvatarUseCase);
    await updateUserAvatar.execute({ avatar_file, user_id });

    return response.status(204).send();
  }
}
