enum PasswordValidationCode {
    NoIssues = 0,
    MinLength,
    MaxLength,
    NumberRequired,
    CaseRequired,
    SpecialCharRequired
}

export class PasswordValidator {
    private readonly password: string;

    constructor(password: string) {
        this.password = password;
    }

    validate(): PasswordValidationCode {
        if (this.password.length < 8) {
            return PasswordValidationCode.MinLength;
        }

        if (this.password.length > 40) {
            return PasswordValidationCode.MaxLength;
        }

        if (!/\d/.test(this.password)) {
            return PasswordValidationCode.NumberRequired;
        }

        if (!/[a-z]/.test(this.password) || !/[A-Z]/.test(this.password)) {
            return PasswordValidationCode.CaseRequired;
        }

        if (!/[@$!%*?&#]/.test(this.password)) {
            return PasswordValidationCode.SpecialCharRequired;
        }

        return PasswordValidationCode.NoIssues;
    }

    getValidationMessage(code?: PasswordValidationCode): string {
        const validationMessages: { [key in PasswordValidationCode]: string } = {
            [PasswordValidationCode.NoIssues]: "No issues found.",
            [PasswordValidationCode.MinLength]: "The password must be at least 8 characters long.",
            [PasswordValidationCode.MaxLength]: "The password must not exceed 40 characters.",
            [PasswordValidationCode.NumberRequired]: "The password must contain at least one number.",
            [PasswordValidationCode.CaseRequired]: "The password must contain both upper and lower case letters.",
            [PasswordValidationCode.SpecialCharRequired]: "The password must contain at least one special character (e.g. @, $, !, %, *, ?, &, #)."
        };

        if (code !== undefined) {
            return validationMessages[code];
        }

        const validationCode = this.validate();
        return validationMessages[validationCode];
    }
}
