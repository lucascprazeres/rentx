import { Router } from "express";

import { AuthenticateUserControlller } from "@modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { RefreshTokenController } from "@modules/accounts/useCases/refreshToken/RefreshTokenController";

const authenticationRoutes = Router();

const authenticateUserController = new AuthenticateUserControlller();
const refreshTokenController = new RefreshTokenController();

authenticationRoutes.post("/sessions", authenticateUserController.handle);
authenticationRoutes.post("/refresh-token", refreshTokenController.handle);

export { authenticationRoutes };
