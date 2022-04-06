import React, {Component} from 'react';
import DeviceOrientation from 'react-device-orientation';
import {Button} from 'antd';
import {Input} from 'antd';

const {TextArea} = Input;

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            isCentered: true,
            time: new Date().getTime(),
            historyStack: [],
        };
    }

    async requestAccess() {
        if (DeviceOrientationEvent && typeof (DeviceOrientationEvent.requestPermission) === "function") {
            console.log("here")
            let permissionState = null;
            try {
                permissionState = await DeviceOrientationEvent.requestPermission();
            } catch (e) {
                console.log(e);
            }

            if (permissionState === "granted") {
                console.log("granted")
                // Permission granted
            } else {
                console.log("denied")
                // Permission denied
            }
        } else {
            console.log("not ios")
        }
    }

    updateInputValue(evt) {
        const val = evt.target.value;
        this.state.historyStack.push(val);
        this.setState({
            inputValue: val,
        });
    }

    delete() {
        if (this.state.inputValue.length > 0 && this.state.isCentered && new Date().getTime() - this.state.time > 500) {
            const val = this.state.inputValue.slice(0, -1);
            this.state.historyStack.push(val);
            this.setState(
                {
                    inputValue: val,
                    time: new Date().getTime(),
                }
            )
        }
    }

    restore() {
        if (this.state.inputValue.length > 0 && this.state.isCentered && new Date().getTime() - this.state.time > 500) {
            const val = this.state.historyStack[this.state.historyStack.length - 1];
            this.state.historyStack.pop();
            this.setState(
                {
                    inputValue: val,
                    time: new Date().getTime(),
                }
            )
        }
    }



    render() {
        return (
            <div>
                <TextArea rows={4} style={{marginTop: 20}} value={this.state.inputValue}
                          onChange={evt => this.updateInputValue(evt)}/>
                {this.state.inputValue}
                <div>
                    <Button type="primary" onClick={this.requestAccess}>Start</Button>
                </div>
                <DeviceOrientation>
                    {
                        ({absolute, alpha, beta, gamma}) => {
                            if (gamma < -45) {
                                console.log("left");
                                this.delete();
                                // this.leaveCenter();
                            } else if (gamma > 45) {
                                console.log("right")
                                this.restore();
                            } else {
                                // this.atCenter();
                                //console.log("center")
                            }

                            return (
                                <div>
                                    <ul>
                                        <li>{`Absolute: ${absolute}`}</li>
                                        <li>{`Alpha: ${alpha.toFixed(2)}`}</li>
                                        <li>{`Beta: ${beta.toFixed(2)}`}</li>
                                        <li>{`Gamma: ${gamma.toFixed(2)}`}</li>
                                    </ul>
                                    <div>

                                    </div>
                                </div>
                            )
                        }

                    }
                </DeviceOrientation>
            </div>
        );
    }
}

export default Main;