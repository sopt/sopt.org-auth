import { FacebookAPIRepository } from "../repository/facebookAPI";
import { FacebookAuthRepository } from "../repository/facebookAuth";
import { UserRepository } from "../repository/user";

export interface AuthService {
  authByFacebook(code: string): Promise<{
    authId: string;
    userId: number;
  }>;
}

interface AuthServiceDeps {
  facebookAPIRepository: FacebookAPIRepository;
  facebookAuthRepository: FacebookAuthRepository;
  userRepository: UserRepository;
}

export function createAuthService({
  facebookAPIRepository,
  facebookAuthRepository,
  userRepository,
}: AuthServiceDeps): AuthService {
  return {
    async authByFacebook(code) {
      const { accessToken } = await facebookAPIRepository.getAccessTokenByCode(code);
      const fbUserInfo = await facebookAPIRepository.getAccessTokenInfo(accessToken);

      let userInfo = await facebookAuthRepository.findByAuthId(fbUserInfo.userId);
      if (!userInfo) {
        const createdUser = await userRepository.createUser();
        userInfo = await facebookAuthRepository.create({
          authId: fbUserInfo.userId,
          userId: createdUser.userId,
        });
      }

      await facebookAuthRepository.setAccessToken(fbUserInfo.userId, accessToken);

      return {
        authId: userInfo.authId,
        userId: userInfo.userId,
      };
    },
  };
}