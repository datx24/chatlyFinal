import React, { useState, useEffect } from 'react';
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, db, storage } from '../lib/firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import upload from '../lib/upload';
import './login.css'
import logoFacebook from '../../images/bxl-facebook.svg.png'
import logoChatly from '../../images/Group 4.png'

const Login = ({ setUser, onSignIn }) => {
  const [value, setValue] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const [messageEmail, setMessageEmail] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [messagePass, setMessagePass] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);


  useEffect(() => {
    setValue(localStorage.getItem('email'));
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Upload user's avatar image to Firebase Storage
      const storageRef = ref(storage, 'avatars/' + user.uid);
      const snapshot = await uploadBytes(storageRef, user.photoURL);
      const photoURL = await getDownloadURL(snapshot.ref);

      // Add user data to Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        id: user.uid,
        blocked: [],
        phoneNumber: user.phoneNumber,
        gender: user?.gender? user.gender : '',
        birthDay: ''
        // Add other user data as needed
      });

      setValue(user.email);
      localStorage.setItem('email', user.email);
      setUser({...user, displayName: user.displayName, photoURL: user.photoURL });
      onSignIn(); // Notify the parent component that the user has signed in
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (!/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email)){
      setError('Email không hợp lệ');
      return;
    }
    if (!/(?=.*\d)(?=.*[a-z]).{6,}/.test(password)) {
      setError('Mật khẩu không hợp lệ');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: userName });
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: userName,
        email: email,
        photoURL: 'https://scontent.fdad1-4.fna.fbcdn.net/v/t1.15752-9/441434590_1146467073333739_7666829099007277589_n.png?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=EZPutV04kP4Q7kNvgFMshKf&_nc_ht=scontent.fdad1-4.fna&oh=03_Q7cD1QE1rrVDMEfbZdi_2pJAxpO3lfj5qg7RKSfa75gMpXXOBw&oe=6672A8CF',
        id :userCredential.user.uid,
        blocked: [],
        phoneNumber: '',
        gender: '',
        birthDay: ''
      });
      setError('');
      // Redirect to login or home page
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email đã được sử dụng');
      } else {
        setError(error.message);
      }
    }
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      // Redirect to home page
    } catch (error) {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  const emailValidation = (e) =>{
    var pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    var emailValue = e.target.value;
    setEmail(emailValue);
    if(email.match(pattern)){
      setMessageEmail(true)
    } else setMessageEmail(false); 
  }

  const passValidation = (e) => {
    var pattern = /(?=.*\d)(?=.*[a-z]).{6,}/;
    var passValue = e.target.value;
    setPassword(passValue);
    if(password.match(pattern)){
      setMessagePass(true);
    } else setMessagePass(false);
  }


  return (
      <div className="login">
        {/* Phần HTML của trang đăng nhập */}
        <header className="header-login"> {/* Thay class thành className */}
            <div className="logo-chatly1">
              <img className='chatly-img' src={logoChatly}></img>
            </div>
            <div className='header-child-right'>
              <li>Dịch vụ</li>
              <li>Liên hệ</li>
              <li>Về chúng tôi</li>
          </div>
        </header>
        <main className='main-login'>
          <section className='main-login-child' style={{width: '100%', display: 'flex'}}>
            <div className='main-left-child'>
              <span>
                NHẮN TIN TRỰC TUYẾN <br />
                NHANH CHÓNG, <br />
                HIỆU QUẢ
              </span>
              <div className='main-left-child-2'>
                <div className="main-left-child-2">
                  <div>
                    <button onClick={(event) => signInWithGoogle(event)} className="btn-gg">
                      <img
                        src={logoFacebook}
                        alt="Google Icon"
                      />
                      Đăng nhập với Google
                    </button>
                    <button type='submit' className="btn-ff">
                      <img
                        src="https://scontent.xx.fbcdn.net/v/t1.15752-9/434559141_966125155051284_8896615487383647192_n.png?stp=cp0_dst-png&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=C3uy7N5k_HkAb5t1s7H&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QFB7Wp4Waem9aBkRNYXRG3qaHEy1uRhcNHWtEcxFptz5w&oe=6646F269"
                        alt="Facebook Icon"
                      />
                      Đăng nhập với Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='main-right-child'>
              <div className= {`wrapper ${isActive ? 'active' : ''}`}>
                <div className='pass-form login-form'>
                  <h2>Đăng nhập</h2>
                  <form onSubmit={handleSubmitLogin}>
                    <div className='input-box'>
                      <i class='bx bxs-envelope' ></i>
                      <input type='text' id='email' onChange={(e) => {setEmail(e.target.value)}} required/>
                      <label>Email</label>
                    </div>
                    <div className='input-box'>
                      <i class='bx bxs-lock-alt' ></i>
                      <input type='password' id='password' onChange={(e) => {setPassword(e.target.value)}} required/>
                      <label>Mật khẩu</label>
                    </div>
                    <div className='remember-forgot'>
                      <label><input type='checkbox'/>Nhớ mật khẩu</label>
                      <a href='#'>Quên mật khẩu</a>
                    </div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                      <button type='submit' className='log-btn'>Đăng nhập</button>
                    </div>
                    <div className='login-register'>
                      <p>Chưa có tài khoản? <a href='#' className='register-link' onClick={() => setIsActive(true)}>Đăng ký</a></p>
                    </div>
                  </form>
                </div>
                <div className='pass-form register-form'>
                  <h2>Đăng ký</h2>
                  <form onSubmit={handleSubmitRegister}>
                    <div className='input-box'>
                      <i class='bx bxs-user'></i>
                      <input type='text' id='username' onChange={(e) => {setUserName(e.target.value)}} value={userName} required/>
                      <label>Tên tài khoản</label>
                    </div>
                    <div className='input-box'>
                      <i class='bx bxs-envelope' ></i>
                      <input 
                        type='text' 
                        id='email' 
                        className='input-control' 
                        autoComplete='off' 
                        onChange={emailValidation}
                        value={email}
                        required/>
                      <label>Email</label>
                      <span className={`text-message ${messageEmail? '': 'error-color'}`}>
                        { email.length == 0 ? '' :
                          messageEmail? '' :
                          'Email không hợp lệ'
                        }
                      </span>
                    </div>
                    <div className='input-box'>
                      <i class='bx bxs-lock-alt' ></i>
                      <input 
                        type='password'
                        id='password'
                        className='input-control'
                        autoComplete='off'
                        onChange={passValidation}
                        value={password} 
                        required/>
                      <label>Mật khẩu</label>
                      <span className={`text-message ${messagePass? '' : 'error-color'}`}>
                        { password.length == 0? '':
                            messagePass? '' :
                            'Mật khẩu phải từ 6 ký tự, bao gồm chữ, số và ký tự đặc biệt'
                        }
                      </span>
                    </div>
                    <div className='input-box'>
                      <i class='bx bxs-lock-alt' ></i>
                      <input type='password' id='confirmPassword'onChange={(e) => {setConfirmPassword(e.target.value)}} value={confirmPassword} required/>
                      <label>Nhập lại mật khẩu</label>
                    </div>
                    <div className='remember-forgot'>
                      <label><input type='checkbox' checked = {agree} onChange={(e) => {setAgree(e.target.checked)}}/>Tôi đồng ý với điều khoản và dịch vụ</label>
                    </div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                      <button type='submit' className='log-btn'>Đăng ký</button>
                    </div>
                    <div className='login-register'>
                      <p>Đã có tài khoản <a href='#' className='login-link' onClick={() => setIsActive(false)}>Đăng nhập</a></p>
                    </div>
                  </form>
                </div>
                    {
                      error && 
                      <div className='error-infor'>
                        <p>{error}</p>
                        <button onClick={() => {setError('')}}>OK</button>
                      </div>
                    }
              </div>
            </div>
          </section>
          
        </main>
      </div>
    );
  };
  
  export default Login;