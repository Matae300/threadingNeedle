import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations';

import { useNavigate } from 'react-router-dom';

import Auth from '../../utils/auth';

const Login = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
      navigate('/me');
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: '',
      password: '',
    });
  };

  return (
      <div className="login-container">
        <div className="">
          <h4 className="login-header">WELCOME BACK!</h4>
          <div className="">
            {data ? (
              <p>
                Success! You are being redirected to the your garden.
              </p>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <input
                  className="login-form-input"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                />
                <input
                  className="login-form-input"
                  placeholder="******"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                />
                <button
                  className="login-button"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                >
                  Log-In
                </button>
              </form>
            )}

            {error && (
              <div className="">
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Login;

  
  