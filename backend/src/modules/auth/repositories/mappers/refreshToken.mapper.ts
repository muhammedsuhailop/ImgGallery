import { RefreshToken } from "../../../../domain/entities/RefreshToken";

import { RefreshTokenDocument } from "../../../../models/RefreshTokenModel";

export const toRefreshTokenEntity = (
  document: RefreshTokenDocument,
): RefreshToken => {
  return {
    id: document._id.toString(),

    userId: document.userId.toString(),

    token: document.token,

    expiresAt: document.expiresAt,
  };
};
