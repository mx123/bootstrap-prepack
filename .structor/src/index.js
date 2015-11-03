require('../../src/client/assets/css/bootstrap.css');
require('../../src/client/assets/css/font-awesome.css');
require('../../src/client/assets/css/app.css');
require('../../src/client/assets/js/bootstrap.js');
module.exports = {
    ReactRouter: {
        Link: require('react-router').Link,
        IndexLink: require('react-router').IndexLink
    },
    ReactBootstrap: {
        Grid: require('react-bootstrap').Grid,
        Row: require('react-bootstrap').Row,
        Col: require('react-bootstrap').Col,
        ButtonToolbar: require('react-bootstrap').ButtonToolbar,
        ButtonGroup: require('react-bootstrap').ButtonGroup,
        Button: require('react-bootstrap').Button,
        DropdownButton: require('react-bootstrap').DropdownButton,
        SplitButton: require('react-bootstrap').SplitButton,
        MenuItem: require('react-bootstrap').MenuItem,
        Panel: require('react-bootstrap').Panel,
        PanelGroup: require('../../src/client/components/ReactBootstrap').PanelGroup,
        Input: require('react-bootstrap').Input,
        Table: require('react-bootstrap').Table,
        Tabs: require('../../src/client/components/ReactBootstrap').Tabs,
        Tab: require('react-bootstrap').Tab,
        Carousel: require('react-bootstrap').Carousel,
        CarouselItem: require('react-bootstrap').CarouselItem,
        ProgressBar: require('react-bootstrap').ProgressBar,
        Navbar: require('react-bootstrap').Navbar,
        NavBrand: require('react-bootstrap').NavBrand,
        Nav: require('../../src/client/components/ReactBootstrap').Nav,
        NavItem: require('react-bootstrap').NavItem,
        NavDropdown: require('react-bootstrap').NavDropdown,
        ListGroup: require('react-bootstrap').ListGroup,
        ListGroupItem: require('react-bootstrap').ListGroupItem,
        Label: require('react-bootstrap').Label,
        Badge: require('react-bootstrap').Badge,
        Well: require('react-bootstrap').Well,
        Alert: require('react-bootstrap').Alert,
        Jumbotron: require('react-bootstrap').Jumbotron,
        AlertDismissable: require('../../src/client/components/ReactBootstrap').AlertDismissable
    },
    ReactBootstrapModal: {
        ModalSubmitCancel: require('../../src/client/components/ReactBootstrapModal').ModalSubmitCancel,
        ModalClose: require('../../src/client/components/ReactBootstrapModal').ModalClose
    },
    Demo: {
        SmartPanel: require('../../src/client/containers/Demo/SmartPanel.jsx'),
        FetchSmartButton: require('../../src/client/containers/Demo/FetchSmartButton.jsx')
    }
};