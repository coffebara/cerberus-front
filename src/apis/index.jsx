import axios from "axios";

const responseHandler = (response) => {
    const responseBody = response.data;
    return responseBody;
}
const errorHandler = (error) => {
    if (!error.response || !error.response.data) return null;
    const responseBody = error.response.data;
    return responseBody;
}

const DOMAIN = 'http://localhost:9090';
const API_DOMAIN = `${DOMAIN}/api/v1`;

export const SNS_SIGN_IN_URL = (provider) => `${API_DOMAIN}/oauth2/authorization/${provider}`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const ID_CHECK_URL = () => `${API_DOMAIN}/auth/id-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;

export const idCheckRequest = async (requestBody) => {
    const result = await axios.post(ID_CHECK_URL(), requestBody)
        .then(responseHandler)
        .catch(errorHandler);
    return result;
}

export const email_certificationRequest = async (requestBody) => {
    const result = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody)
        .then(responseHandler)
        .catch(errorHandler);
    return result;
}

export const checkCertificationRequest = async (requestBody) => {
    const result = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
        .then(responseHandler)
        .catch(errorHandler);
    return result;
}

export const signInRequest = async (requestBody) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(responseHandler)
        .catch(errorHandler)
    return result;
}

export const signUpRequest = async (requestBody) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(responseHandler)
        .catch(errorHandler)
    return result;
}