var React = require('react');

var PageForDesk = React.createClass({


    render: function() {

        return (
            <h4>{'Route not found: ' + this.props.location.pathname}</h4>
        );
    }

});

module.exports = PageForDesk;
