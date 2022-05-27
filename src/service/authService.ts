import { FacebookAPIRepository } from "../repository/facebookAPI";
import { FacebookAuthRepository } from "../repository/facebookAuth";
import { UserRepository } from "../repository/user";

const SOPT_NOTICE_GROUP_ID = "1392673424331756";

export interface AuthService {
  authByFacebook(code: string): Promise<{
    authId: string;
    userId: number;
  } | null>;
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
      const accessToken = await facebookAPIRepository.getAccessTokenByCode(code);

      if (!accessToken) {
        return null;
      }

      const fbUserInfo = await facebookAPIRepository.getAccessTokenInfo(accessToken);

      let authInfo = await facebookAuthRepository.findByAuthId(fbUserInfo.userId);

      if (!authInfo) {
        const groupInfo = await facebookAPIRepository.getGroupInfo(fbUserInfo.userId, accessToken);
        const soptNotice = groupInfo.find((group) => group.groupId === SOPT_NOTICE_GROUP_ID);
        if (!soptNotice) {
          return null;
        }

        const createdUser = await userRepository.createUser({ name: fbUserInfo.userName });
        authInfo = await facebookAuthRepository.create({
          authId: fbUserInfo.userId,
          userId: createdUser.userId,
        });
      }
      await facebookAuthRepository.setAccessToken(fbUserInfo.userId, accessToken);

      if (!authInfo.userId) {
        throw new Error("It's currently not possible.");
      }

      return {
        authId: authInfo.authId,
        userId: authInfo.userId,
      };
    },
  };
}
