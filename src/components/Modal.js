import React, { Component } from 'react';
import { Modal, Alert } from 'react-native';
import { Container, Form, Item, Input, Label, Text, Button, Title, Subtitle, Header, Left, Right } from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';
import Auth from "./auth"

class LoginModal extends Component {
    state = {
        modalVisible: false,
        email: "",
        password: ""
    };


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        const { email, password } = this.state;
        return (
            <Container>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <Container>
                        <Header>
                            <Left>
                                <Button transparent onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                                    <Icon name="close" size={30} />
                                </Button>
                            </Left>
                            <Title>Log In!</Title>
                            <Right />
                        </Header>

                        <Form style={{ marginTop: 50 }}>
                            <Item style={{ marginTop: "10%" }} fixedLabel last>
                                <Label>Email</Label>
                                <Input
                                    value={this.state.email}
                                    onChangeText={email => this.setState({ email })}
                                />
                            </Item>

                            <Item style={{ marginTop: "10%" }} fixedLabel last>
                                <Label>Password</Label>
                                <Input
                                    value={this.state.password}
                                    onChangeText={password => this.setState({ password })}
                                    secureTextEntry={true}
                                />
                            </Item>

                            <Button full info style={{ marginTop: 100, height: 80 }} onPress={() => {
                                email.trim()
                                password.trim()
                                Auth(email, password, "signIn", () => this.setModalVisible(!this.state.modalVisible));
                            }}>
                                <Text>Sign In</Text>
                            </Button>
                        </Form>
                    </Container>
                </Modal>

                {/* <Subtitle>Or</Subtitle> */}

                <Button full block info onPress={() => this.setModalVisible(true)}>
                    <Text
                        style={{ justifyContent: 'center' }}
                        TextToShow={this.props.TextToShow}
                    >
                        {this.props.TextToShow}

                    </Text>
                </Button>



            </Container>
        );
    }
}

export default LoginModal
