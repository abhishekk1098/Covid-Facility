// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";
import google from "../images/Google.png";
import AuthContext from "../models/AuthContext";

class Login extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            userEmail: "",
            userPassword: "",
			emailError: "",
			passError: "",
			loading: false
        };
        // Bind Functions ->
        this.clearError = this.clearError.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
        this.errorHandler = this.errorHandler.bind(this);
		this.logInWithEmail = this.logInWithEmail.bind(this);
		this.logInWithGoogle = this.logInWithGoogle.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    // Clear Errors ->
    clearError() {
        this.setState({
            passError: "",
            emailError: "",
        });
    }

    // Clear Inputs ->
    clearInputs() {
        this.setState({
            userEmail: "",
            userPassword: "",
        });
    }

    // Error Handler ->
    errorHandler(err) {
        switch (err.code) {
            case "auth/invalid-email":
            case "auth/user-disabled":
			case "auth/user-not-found":
                this.setState({
                    emailError: err.message,
                });
                break;
            case "auth/wrong-password":
                this.setState({
                    passError: err.message,
                });
        }
    }

    // User log in with Email ->
    async logInWithEmail(e) {
		e.preventDefault();
		const {logInWithEmail} = this.context;
		try{
			this.clearError();
            this.setState({ loading: true });
			await logInWithEmail(
				this.state.userEmail,
				this.state.userPassword
			)
			this.clearInputs();
			this.props.history.push('/volunteer/dashboard');
		} catch(err){
			this.errorHandler(err)
		}
		this.setState({ loading: false });
	}

	async logInWithGoogle(e) {
		e.preventDefault();
		const {logInWithGoogle} = this.context;
		try{
			this.clearError();
            this.setState({ loading: true });
			await logInWithGoogle()
			this.clearInputs();
			this.props.history.push('/volunteer/dashboard');
		} catch(err){
			this.errorHandler(err)
		}
		this.setState({ loading: false });
	}

    // On Change Event Handler ->
    onChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    render() {
        return (
            <>
                <div id='signUpPlace' className='float-right'>
                    <button
                        id='signUp'
                        className='button'
                        onClick={() =>
                            this.props.history.push("/volunteer/register")
                        }
                    >
                        Sign Up
                    </button>
                </div>
                <div id='register' className='container-fluid'>
                    <div className='row ml-md-5'>
                        <div className='col-md-5 pl-md-5'>
                            <h2>Welcome Back</h2>
                            <h6>Just a moment</h6>
                            <form>
                                <div className='form-group'>
                                    <input
                                        type='email'
                                        name='userEmail'
                                        className='form-control'
                                        placeholder='Email ID'
                                        required
                                        onChange={this.onChangeHandler}
                                    />
                                </div>
								<small className="form-text">
                                    {this.state.emailError}
                                </small>
                                <div className='form-group'>
                                    <input
                                        type='password'
                                        name='userPassword'
                                        className='form-control'
                                        placeholder='Password'
                                        disabled={this.state.loading}
                                        onChange={this.onChangeHandler}
                                    />
                                </div>
								<small className="form-text">
                                    {this.state.passError}
                                </small>
                                <div className='row'>
                                    <div className='col-sm-3 col-4'>
                                        <button
                                            id='logIn'
                                            type='submit'
                                            className='button'
											disabled={this.state.loading}
                                            onClick={this.logInWithEmail}
                                            style={{ marginTop: "7px" }}
                                        >
                                            Log In
                                        </button>
                                    </div>
                                    <div className='col-8'>
                                        <button
                                            id='gog-mob'
                                            type='button'
                                            className='btn shadow-sm bg-white'
											disabled={this.state.loading}
                                            onClick={this.logInWithGoogle}
                                        >
                                            <img src={google} alt='Google' />
                                            <span>Log In with Google</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <br />
                            <br />
                            <div id='deskView'>
                                <h6>
                                    Or you can Log In with your Google account
                                </h6>
                                <button
                                    id='gog'
                                    type='button'
                                    className='btn shadow-sm bg-white'
                                    onClick={this.logInWithGoogle}
                                >
                                    <img src={google} alt='Google' />
                                    <span>Log In with Google</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Login;
