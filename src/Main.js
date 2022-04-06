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
            pointer: 0,
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
        this.state.historyStack.splice(this.state.pointer + 1, this.state.historyStack.length);
        this.state.historyStack.push(val);

        this.setState({
            inputValue: val,
            pointer: this.state.pointer + 1,
        });
    }

    delete() {
        if (this.state.inputValue.length > 0 && new Date().getTime() - this.state.time > 500) {

            let step = 1;
            let index = Math.max(this.state.pointer - step, 0);

            this.setState(
                {
                    inputValue: this.state.historyStack[index],
                    pointer: index,
                    time: new Date().getTime(),
                }
            )
        }
    }

    restore() {
        if (this.state.inputValue.length > 0 && new Date().getTime() - this.state.time > 500) {
            let index = Math.min(this.state.pointer + 1, this.state.historyStack.length - 1);
            console.log(this.state.historyStack)
            this.setState(
                {
                    pointer: index,
                    inputValue: this.state.historyStack[index],
                    time: new Date().getTime(),
                }
            )
        }
    }



    render() {
        return (
            <div>
                <div>
                    <Button style={{marginTop: 20}} type="primary" onClick={this.requestAccess}>Start</Button>
                </div>
                <TextArea rows={4} style={{marginTop: 20}} value={this.state.inputValue}
                          onChange={evt => this.updateInputValue(evt)}/>
                <DeviceOrientation>
                    {
                        ({alpha, beta, gamma}) => {
                            if (gamma < -45) {
                                this.delete();
                            } else if (gamma > 45) {
                                this.restore();
                            }

                            return (
                                <div>
                                    <ul>
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