import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';

const Login = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);

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
                Success!
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
                  Login
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