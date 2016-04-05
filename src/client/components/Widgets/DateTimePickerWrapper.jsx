import React, { Component, PropTypes } from 'react';
import { DateTimePicker } from 'react-widgets';

class DateTimePickerWrapper extends Component {

    constructor(props, content) {
        super(props, content);
    }
    render() {
        return (
            <div>
                <p>Text</p>
                <DateTimePicker {...this.props} defaultValue={new Date()} />
            </div>
            );
    }
}

export default DateTimePickerWrapper;
