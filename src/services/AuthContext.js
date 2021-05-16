import React, { Component } from 'react';
import { auth } from './Firebase';
import { addUserData, getUserRole } from './FirebaseHandler';
import { provider } from './Firebase';

const AuthContext = React.createContext();

export class AuthProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            loading: true,
            userRole: '',
        };

        // Bind Functions ->
        this.authListener = this.authListener.bind(this);
        this.signUpWithEmail = this.signUpWithEmail.bind(this);
        this.signUpWithGoogle = this.signUpWithGoogle.bind(this); // Same Method for Google LogIn/SignUp
        this.logInWithEmail = this.logInWithEmail.bind(this);
        // this.getRole = this.getRole.bind(this);
    }

    componentDidMount() {
        this.authListener();
    }

    // User signUp With Email & Password->
    signUpWithEmail(name, email, password, contact = null) {
        return auth
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
                const user = res.user;
                addUserData(user.uid, name, email, contact);
            });
    }

    // User Signup/Login with Google ->
    signUpWithGoogle() {
        return auth.signInWithPopup(provider).then((res) => {
            const user = res.user;
            if (res.additionalUserInfo.isNewUser) {
                addUserData(
                    user.uid,
                    user.displayName,
                    user.email,
                    user.phoneNumber
                );
            }
        });
    }

    // User login with Email & Password ->
    logInWithEmail(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    // Get user Role ->
    // async getRole(userId) {
    //     const role = await getUserRole(userId);
    //     this.setState({
    //         userRole: role,
    //     });
    //     console.log(this.state.userRole);
    // }

    // User logout ->
    logout = () => {
        return auth.signOut();
    };

    // User password reset ->
    resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    // Authenticate user (to check if user is logged) ->
    authListener() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                getUserRole(user.uid).then((role) => {
                    this.setState({
                        currentUser: user,
                        loading: false,
                        userRole: role,
                    });
                });
            } else {
                this.setState({
                    currentUser: user,
                    loading: false,
                    userRole: '',
                });
            }
        });
    }
    render() {
        const { currentUser, loading, userRole } = this.state;
        // console.log('2', userRole, currentUser);
        const {
            signUpWithEmail,
            signUpWithGoogle,
            logInWithEmail,
            logInWithGoogle,
            logout,
            resetPassword,
            // getRole,
        } = this;
        return (
            <AuthContext.Provider
                value={{
                    currentUser,
                    loading,
                    userRole,
                    signUpWithEmail,
                    signUpWithGoogle,
                    logInWithEmail,
                    logInWithGoogle,
                    logout,
                    resetPassword,
                    // getRole,
                }}
            >
                {!loading && this.props.children}
            </AuthContext.Provider>
        );
    }
}

export default AuthContext;
