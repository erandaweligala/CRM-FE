export const getSecureRandomIndex = (length: number): number => {
    if (length <= 0) throw new Error("Length must be greater than 0");

    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);

    return Math.floor((randomArray[0] / (0xFFFFFFFF + 1)) * length);
};
export const generateSecureRandomMobileNumber = (): string => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const num = Math.floor((array[0] / (0xFFFFFFFF + 1)) * 1_000_000);
    return `077${num.toString().padStart(7, '0')}`;
};
export const getSecureRandomOperationStatus = (): "Success" | "Failed" => {
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0] / (2 ** 32);
    return randomValue < 0.9 ? "Success" : "Failed";
};
