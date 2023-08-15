enum PasswordValidationCode {
    NoIssues = 0,
    MinLength,
    MaxLength,
    NumberRequired,
    CaseRequired,
    SpecialCharRequired
}

export default class PasswordValidator {
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

        if (!/[^\w\s]/.test(this.password)) {
            return PasswordValidationCode.SpecialCharRequired;
        }

        return PasswordValidationCode.NoIssues;
    }

    isStrong(): boolean {
        return this.validate() === PasswordValidationCode.NoIssues;
    }

    getValidationMessage(code?: PasswordValidationCode): string {
        const validationMessages: { [key in PasswordValidationCode]: string } = {
            [PasswordValidationCode.NoIssues]: "Good password",
            [PasswordValidationCode.MinLength]: "Password needs to be at least 8 characters long.",
            [PasswordValidationCode.MaxLength]: "Password must not exceed 40 characters.",
            [PasswordValidationCode.NumberRequired]: "Password must contain at least one number.",
            [PasswordValidationCode.CaseRequired]: "Must contain both upper and lower case letters.",
            [PasswordValidationCode.SpecialCharRequired]: "Must contain at least one special character."
        };

        if (code !== undefined) {
            return validationMessages[code];
        }

        const validationCode = this.validate();
        return validationMessages[validationCode];
    }
}
