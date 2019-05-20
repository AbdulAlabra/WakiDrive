import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image } from 'react-native';
import Pay from '../components/payment/Pay'



export default class PhoneAuthTest extends Component {



    renderVerificationCodeInput() {
        const { codeInput } = this.state;

        return (
            <View style={{ marginTop: 25, padding: 25 }}>
                <Text>Enter verification code below:</Text>
                <TextInput
                    autoFocus
                    style={{ height: 40, marginTop: 15, marginBottom: 15 }}
                    onChangeText={value => this.setState({ codeInput: value })}
                    placeholder={'Code ... '}
                    value={codeInput}
                />
                <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
            </View>
        );
    }

    render() {
        // const { user, confirmResult } = this.state;
        // return (
        //     <View style={{ flex: 1 }}>

        //         {!user && !confirmResult && this.renderPhoneNumberInput()}

        //         {this.renderMessage()}

        //         {!user && confirmResult && this.renderVerificationCodeInput()}

        //         {user && (
        //             <View
        //                 style={{
        //                     padding: 15,
        //                     justifyContent: 'center',
        //                     alignItems: 'center',
        //                     backgroundColor: '#77dd77',
        //                     flex: 1,
        //                 }}
        //             >
        //                 <Image source={{ uri: successImageUri }} style={{ width: 100, height: 100, marginBottom: 25 }} />
        //                 <Text style={{ fontSize: 25 }}>Signed In!</Text>
        //                 <Text>{JSON.stringify(user)}</Text>
        //                 <Button title="Sign Out" color="red" onPress={this.signOut} />
        //             </View>
        //         )}
        //     </View>
        // );
        return (
            <Pay />
        )
    }
}