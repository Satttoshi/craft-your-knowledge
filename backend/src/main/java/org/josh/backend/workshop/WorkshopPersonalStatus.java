package org.josh.backend.workshop;

import org.josh.backend.security.MongoUser;
import org.josh.backend.security.MongoUserWithIdAndName;
import org.josh.backend.utils.ProgressStatus;

public record WorkshopPersonalStatus(
    MongoUserWithIdAndName user,
    ProgressStatus progressStatus,
    boolean isLiked

) {
}
