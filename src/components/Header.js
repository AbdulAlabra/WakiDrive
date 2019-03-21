import React, { Component } from "react";
import { Header, Title, Button, Left, Right, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LocationIcon from 'react-native-vector-icons/FontAwesome';


class Header1 extends Component {
    
    render() {
        const { title, rightIconName, leftIconName, iconSize, onPressRight, onPressLeft, onPressTitle, rightIconColor } = this.props;
        return (
            <Header
                title={title}
                rightIconName={rightIconName}
                leftIconName={leftIconName}
                rightIconColor={rightIconColor}
                iconSize={iconSize}
                onLongPressRight={() => onLongPressRight}
                onPressRight={() => onPressRight}
                onPressLeft={() => onPressLeft}
                onPressTitle={() => onPressTitle}
                onLongPressTitle={() => onLongPressTitle}
                
            >
                <Left>
                    <Button transparent onPress={this.props.onPressLeft}>
                        {/* <Icon name={leftIconName} size={iconSize} /> */}
                        <Text>left</Text>
                    </Button>
                </Left>
                <Button transparent onLongPress={this.props.onLongPressTitle} onPress={this.props.onPressTitle} style={{ marginTop: 5 }}>
                <Title>{title}</Title>
                </Button>

                <Right>
                    <Button transparent onLongPress={this.props.onLongPressRight} onPress={this.props.onPressRight}>
                        <LocationIcon color={ this.props.rightIconColor || "#00cc00" } name={rightIconName} size={iconSize} />
                        {/* <Text>Right</Text> */}
                    </Button>
                </Right>
            </Header>

        );
    }
}

export default Header1
