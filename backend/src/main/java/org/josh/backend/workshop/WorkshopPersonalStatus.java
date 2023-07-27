package org.josh.backend.workshop;

import org.josh.backend.security.MongoUserWithoutPassword;
import org.josh.backend.utils.ProgressStatus;

public record WorkshopPersonalStatus(
    MongoUserWithoutPassword user,
    ProgressStatus progressStatus,
    boolean isLiked

) {
}
