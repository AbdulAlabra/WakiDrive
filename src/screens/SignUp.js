import React, { Component } from "react";
import { Container, Header, Title, Button, Left, Right, Text } from 'native-base';

// import Icon from 'react-native-vector-icons/FontAwesome5';


class SignUp extends Component {

    static navigationOptions = {
        header: null
    }

    //ios-arrow-back
    render() {
        return (

            <Container>
                <Header>
                    <Left>
                        <Text onPress={() =>  this.props.navigation.navigate('Home')}>Go Back</Text>
                        {/* // <Icon name='ios-arrow-back' size={30} onPress={() => this.props.navigation.navigate('Home')} /> */}
                    </Left>
                    <Title style={{ marginTop:10 }}>
                        SignUp
                    </Title>
                    <Right> 
                        <Button onPress={() => this.props.navigation.navigate('SignUpForm')}>
                        <Text>Click Me</Text>
                        </Button>
                    </Right>
                </Header>
            </Container>
        );
    }
}

export default SignUp