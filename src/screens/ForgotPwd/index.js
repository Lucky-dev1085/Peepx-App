import React from 'react';
import { Animated } from 'react-native';
import { Box, Text } from 'react-native-design-utility';
import { inject } from 'mobx-react/native';

import SplashScreenLogo from '../../components/SplashScreenLogo';
import { Button, Input, LinkWithArrow } from '../../components/common';
import { theme } from '../../constants';
import { NavigationService } from '../../services/NavigationService';
import { isEmptyInput, promisify } from '../../utils';
import { authStorePropTypes } from '../../types';

const initialState = {
    opacity: new Animated.Value(0),
    position: new Animated.Value(0),
    email: '',
    isLoading: false,
    disableLoginButton: false,
    error: '',
};

@inject('authStore')
class ForgotPwd extends React.Component {
    static propTypes = {
        ...authStorePropTypes,
    };

    state = { ...initialState };

    handleOpacityAnimation = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 350,
            delay: 100,
        }).start();
    };

    handlePositionAnimation = () => {
        Animated.timing(this.state.position, {
            toValue: 1,
            duration: 550,
            useNativeDriver: true,
        }).start();
    };

    handleSendMail = async () => {
        this.setState({
            isLoading: true,
            disableLoginButton: true,
            disableOAuthButtons: true,
        });

        const { email } = this.state;
        const userInput = { email };
        const checkInputValues = isEmptyInput(userInput);
        if (checkInputValues) {
            /* eslint-disable no-unused-vars */
            const [_, err] = await promisify(
                this.props.authStore.forgotPwd(userInput),
            );
            /* eslint-enable no-unused-vars */
            if (err) {
                console.log(err);

                this.setState({
                    isLoading: false,
                    disableLoginButton: false,
                    disableOAuthButtons: false,
                    error: err.toString(),
                });
            } else {
                this.setState({
                    isLoading: false,
                    disableLoginButton: false,
                    disableOAuthButtons: false,
                    successMsg: 'Please check your email.',
                });
            }
        } else {
            this.setState({
                isLoading: false,
                disableLoginButton: false,
                disableOAuthButtons: false,
                error: 'You must fill in fields.',
            });
        }
    };

    handleInput = (name, value) => {
        this.setState({ [name]: value });
    };

    handleLoginNavigation = () => {
        NavigationService.navigate('Login');
    };

    componentDidMount() {
        Animated.parallel([
            this.handleOpacityAnimation(),
            this.handlePositionAnimation(),
        ]);
        this.props.authStore.setupAuth();
    }

    render() {
        const {
            position,
            opacity,
            email,
            error,
            successMsg,
            isLoading,
            disableLoginButton,
        } = this.state;
        const logoTranslate = position.interpolate({
            inputRange: [0, 1],
            outputRange: [150, 15],
        });
        return (
            <Box f={1} center bg="white">
                <Box f={1} w="80%">
                    <Animated.View
                        style={{
                            flex: 0.7,
                            transform: [
                                {
                                    translateY: logoTranslate,
                                },
                            ],
                        }}>
                        <SplashScreenLogo width={300} height={300} />
                    </Animated.View>
                    <Animated.View
                        style={{
                            flex: 0.6,
                            alignItems: 'center',
                            width: '100%',
                            opacity,
                        }}>
                        <Box
                            style={{
                                width: '100%',
                                flex: 0.8,
                            }}
                            mb="xs">
                            {!!error && (
                                <Box f={1} h={15} center>
                                    <Text color="red" bold>
                                        {error}
                                    </Text>
                                </Box>
                            )}
                            <Input
                                placeholder="Email"
                                onChangeText={text =>
                                    this.handleInput('email', text)
                                }
                                value={email}
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                keyboardType="email-address"
                                spellCheck={false}
                                error={error}
                                label="Email"
                            />
                            {!!successMsg && (
                                <Box f={1} h={15} center>
                                    <Text color="blue" bold>
                                        {successMsg}
                                    </Text>
                                </Box>
                            )}
                        </Box>
                        <Box f={0.4} w="100%">
                            <Button
                                onPress={this.handleSendMail}
                                disabled={disableLoginButton}
                                isLoading={isLoading}>
                                <Box f={1} center>
                                    <Text color="white">Send</Text>
                                </Box>
                            </Button>
                        </Box>
                    </Animated.View>
                    <Animated.View
                        style={{
                            flex: 0.4,
                            width: '100%',
                            flexDirection: 'column',
                            opacity,
                            borderTopWidth: 1,
                            borderTopColor: theme.color.greyLighter,
                        }}>
                        <Box f={1} center w="100%">
                            <LinkWithArrow
                                onPress={this.handleLoginNavigation}
                                disabled={disableLoginButton}
                                text="Login"
                                arrowLeft={true}
                            />
                        </Box>
                    </Animated.View>
                </Box>
            </Box>
        );
    }
}

export default ForgotPwd;
