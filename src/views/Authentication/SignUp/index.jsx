import { ChangeEvent, useRef, useState, KeyboardEvent } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { SNS_SIGN_IN_URL, checkCertificationRequest, email_certificationRequest, idCheckRequest, signUpRequest } from "../../../apis";
import InputBox from "./../../../components/inputBox"


export default function SignUp() {

    const idRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordCheckRef = useRef(null);
    const emailRef = useRef(null);
    const certificationNumberRef = useRef(null);

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [email, setEmail] = useState('');
    const [certificationNumber, setCertificationNumber] = useState('');

    const [isIdError, setIdError] = useState(false);
    const [isPasswordError, setPasswordError] = useState(false);
    const [isPasswordCheckError, setPasswordCheckError] = useState(false);
    const [isEmailError, setEmailError] = useState(false);
    const [isCertificationNumberError, setCertificationNumberError] = useState(false);

    const [idMessage, setIdMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordCheckMessage, setPasswordCheckMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [certificationNumberMessage, setCertificationNumberMessage] = useState('');

    const [isIdCheck, setIdCheck] = useState(false);
    const [isCertificationCheck, setCertificationCheck] = useState(false);

    const signUpButtonClass = id && password && passwordCheck && email && certificationNumber ?
    'primary-button-lg' : 'disable-button-lg';

    const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;

    const navigate = useNavigate();


    const idCheckResponse = (responseBody) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === ResponseCode.VALIDATION_FAIL) alert('아이디를 입력하세요.');
        if (code === ResponseCode.DUPLICATE_EMAIL) {
            setIdError(true);
            setIdMessage('이미 사용중인 아이디 입니다.');
            setIdCheck(false);
        }
        if (code === ResponseCode.DATABASE_ERROR) alert('데이버테이스 오류입니다.');
        if (code !== ResponseCode.SUCCESS) return;

        setIdError(false);
        setIdMessage('사용 가능한 아이디입니다.');
        setIdCheck(true);
    }

    const emailCertificationResponse = (responseBody) => {

        if (!responseBody) return;
        const { code } = responseBody;

        if (code === ResponseCode.VALIDATION_FAIL) alert('아이디와 이메일을 모두 입력하세요.');
        if (code === ResponseCode.DUPLICATE_EMAIL) {
            setIdError(true);
            setIdMessage('이미 사용중인 아이디 입니다.');
            setIdCheck(false);
        }
        if (code === ResponseCode.MAIL_FAIL) alert('메일 전송이 실패했습니다.');
        if (code === ResponseCode.DATABASE_ERROR) alert('데이버테이스 오류입니다.');
        if (code !== ResponseCode.SUCCESS) return;

        setEmailError(false);
        setEmailMessage('인증번호가 전송되었습니다.');
    }

    const checkCertificationResponse = (responseBody) => {

        if(!responseBody) return;

        const { code } = responseBody;
        if (code === ResponseCode.VALIDATION_FAIL) alert('아이디, 이메일, 인증번호를 모두 입력하세요.');
        if (code === ResponseCode.CERTIFICATION_FAIL) {
            setCertificationNumberError(true);
            setCertificationNumberMessage('인증번호가 일치하지 않습니다');
            setCertificationCheck(false);
        }
        if (code === ResponseCode.DATABASE_ERROR) alert('데이버테이스 오류입니다.');
        if (code !== ResponseCode.SUCCESS) return;

        setCertificationNumberError(false);
        setCertificationNumberMessage('인증번호가 확인되었습니다.');
        setCertificationCheck(true);

    }

    const SignUpResponse = (responseBody) => {

        if(!responseBody) return;

        const { code } = responseBody;
        if (code === ResponseCode.VALIDATION_FAIL) alert('모든 값을 입력하세요.');
        if (code === ResponseCode.DUPLICATE_EMAIL) {
            setIdError(true);
            setIdMessage('이미 사용중인 아이디 입니다.');
            setIdCheck(false);
        }
        if (code === ResponseCode.CERTIFICATION_FAIL) {
            setCertificationNumberError(true);
            setCertificationNumberMessage('인증번호가 일치하지 않습니다');
            setCertificationCheck(false);
        }
        if (code === ResponseCode.DATABASE_ERROR) alert('데이버테이스 오류입니다.');
        if (code !== ResponseCode.SUCCESS) return;

        navigate('/auth/sign-in');
    }

    const onIdChangeHandler = (event) => {
        const { value } = event.target;
        setId(value);
        setIdMessage('');
        setIdCheck(false);
    };

    const onPasswordChangeHandler = (event) => {
        const { value } = event.target;
        setPassword(value);
        setPasswordMessage('');
    };

    const onPasswordCheckChangeHandler = (event) => {
        const { value } = event.target;
        setPasswordCheck(value);
        setPasswordCheckMessage('');
    };

    const onEmailChangeHandler = (event) => {
        const { value } = event.target;
        setEmail(value);
        setEmailMessage('');
    };

    const onCertificationNumberChangeHandler = (event) => {

        const { value } = event.target;
        setCertificationNumber(value);
        setCertificationNumberMessage('');
    };

    const onIdButtonClickHandler = () => {

        if (!id) return;
        const requestBody = { id };

        idCheckRequest(requestBody).then(idCheckResponse);
    };

    const onEmailButtonClickHandler = () => {

        if (!id || !email) return;

        const checkedEmail = emailPattern.test(email);
        if (!checkedEmail) {
            setEmailError(true);
            setEmailMessage('이메일 형식이 아닙니다.');
            return;
        }

        const requestBody = { id, email };
        email_certificationRequest(requestBody).then(emailCertificationResponse);

        setEmailError(false);
        setEmailMessage('이메일 전송중...');

    };

    const onCertificationNumberButtonClickHandler = () => {

        if(!id || !email) return;

        const requestBody = { id, email, certificationNumber };
        checkCertificationRequest(requestBody).then(checkCertificationResponse);
    };

    const onSignUpButtonClickHandler = () => {
        
        if (!id || !email || !password || !certificationNumber) return;
        if (!isIdCheck) {
            alert('중복 확인은 필수입니다.')
            return;
        }
        const checkedPassword = passwordPattern.test(password);
        if (!checkedPassword) {
            setPasswordError(true);
            setPasswordMessage('영문, 숫자를 혼합하여 8~13자 입력해주세요.');
            return;
        }
        if (password !== passwordCheck) {
            setPasswordCheckError(true);
            setPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!isCertificationCheck) {
            alert('이메일 인증은 필수입니다.');
            return;
        }

        const requestBody = { id, password, email, certificationNumber };
        signUpRequest(requestBody).then(SignUpResponse);
        
    };


    const onSignInButtonClickHandler = () => {
        navigate('auth/sign-in');
    };

    const onSnsSignInButtonClickHandler = (provider) => {
        window.location.href = SNS_SIGN_IN_URL(provider);
    }


    const onIdKeyDownHandler = (event) => {
        if (event.key !== 'Enter') return; // Enter 키가 아니면 종료
        onIdButtonClickHandler();
    }
    const onPasswordKeyDownHandler = (event) => {
        if (event.key !== 'Enter') return;
        if (!passwordCheckRef.current) return;
        passwordCheckRef.current.focus(); // Enter를 입력하면 passwordCheck(다음 창)로 이동
    }
    const onPasswordCheckKeyDownHandler = (event) => {
        if (event.key !== 'Enter') return;
        if (!emailRef.current) return;
        emailRef.current.focus();
    }
    const onEmailKeyDownHandler = (event) => {
        if (event.key !== 'Enter') return;
        onEmailButtonClickHandler(); // 이메일 인증이 동작
    }
    const onCertificationNumberKeyDownHandler = (event) => {
        if (event.key !== 'Enter') return;
        onCertificationNumberButtonClickHandler();
    }


    return (
        <div id="sign-up-wrapper">
            <div className="sign-up-image"></div>
            <div className="sign-up-container">
                <div className="sign-up-box">
                    <div className="sign-up-title">{"오늘 산책 완료 !"}</div>
                    <div className="sign-up-content-box">
                        <div className="sign-up-content-sns-sign-in-box">
                            <div className="sign-up-content-sns-sign-in-title">{'SNS 회원가입'}</div>
                            <div className="sign-up-content-sns-sign-in-button-box">
                                <div className="kakao-sign-in-button" onClick={() => onSnsSignInButtonClickHandler('kakao')}></div>
                                <div className="naver-sign-in-button" onClick={() => onSnsSignInButtonClickHandler('naver')}></div>
                                <div className="google-sign-in-button" onClick={() => onSnsSignInButtonClickHandler('google')}></div>
                            </div>
                        </div>
                        <div className="sign-up-content-divider"></div>
                        <div className="sign-up-content-input-box">
                            <InputBox ref={idRef} title="아이디" placeholder="아이디를 입력해주세요" type="text" value={id} onChange={onIdChangeHandler} isErrorMessage={isIdError} message={idMessage} buttonTitle="중복 확인" onButtonClick={onIdButtonClickHandler} onKeyDown={onIdKeyDownHandler}/>
                            <InputBox ref={passwordRef} title="비밀번호" placeholder="비밀번호를 입력해주세요" type="password" value={password} onChange={onPasswordChangeHandler} isErrorMessage={isPasswordError} message={passwordMessage} onKeyDown={onPasswordKeyDownHandler}/>
                            <InputBox ref={passwordCheckRef} title="비밀번호 확인" placeholder="비밀번호를 입력해주세요" type="password" value={passwordCheck} onChange={onPasswordCheckChangeHandler} isErrorMessage={isPasswordCheckError} message={passwordCheckMessage} onKeyDown={onPasswordCheckKeyDownHandler}/>
                            <InputBox ref={emailRef} title="이메일" placeholder="이메일 주소를 입력해주세요" type="text" value={email} onChange={onEmailChangeHandler} isErrorMessage={isEmailError} message={emailMessage} buttonTitle="이메일 인증" onButtonClick={onEmailButtonClickHandler} onKeyDown={onEmailKeyDownHandler}/>
                            <InputBox ref={certificationNumberRef} title="인증번호" placeholder="인증번호 4자리를 입력해주세요" type="text" value={certificationNumber} onChange={onCertificationNumberChangeHandler} isErrorMessage={isCertificationNumberError} message={certificationNumberMessage} buttonTitle="인증 확인" onButtonClick={onCertificationNumberButtonClickHandler} onKeyDown={onCertificationNumberKeyDownHandler}/>
                        </div>
                        <div className="sign-up-content-button-box">
                            <div className={`${signUpButtonClass} full-width`} onClick={onSignUpButtonClickHandler}>{"회원가입"}</div>
                            <div className="text-link-lg full-width" onClick={onSignInButtonClickHandler}>{"로그인"}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
