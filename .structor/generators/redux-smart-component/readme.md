#### Generator creates a scaffold for Redux smart component structure.

##### Used libraries:
* `redux` `react-redux` `redux-actions (sequence)` `redux-promise (sequence)` `reduce-reducers`

##### Files:
* Component: `src/client/containers/{groupName}/{componentName}.jsx`
* Initial state: ```src/client/store/initialState.js```
* Actions (creators + reducers): ```src/client/actions/{groupName}/{componentName}Actions.js```
* Actions index: ```src/client/actions/index.js```
* Reducers combination: ```src/client/reducers/index.js```

___*to change output file path edit ./structor/generators/react-smart/generator.json___

----
#### Action + event with prevent propagation + ref to input element

* ___Meta___ 

```
"component": {
    ...
    "handlers": {
        "handleClick": "(e) => printText($inputText.getValue())"
    },
    "reducerRoot": "rootState"
    ...
}
"render": {
    ...
    "type": "Button",
    "props": {
        "onClick": "$handleClick"
    }
    ...
    "type": "Input",
    "props": {
        "ref": "inputText"
    }
    ...
}
```

* ___Component file___ 

```
...
handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const {dispatch} = this.props;
    const {inputText} = this.refs;
    dispatch(printText(inputText.getValue()));
}
...
render(){
    ...
    return (
        <Button onClick={this.handleClick}>...</Button>
        <Input ref="inputText" />
    )
    ...
}
...

```

* ___Actions file___ ```has to be edited after saving```

```
const PRINT_TEXT = 'PRINT_TEXT';

export const printText = createAction(PRINT_TEXT, inputText => {
    return {};
});

export default handleActions({
    [PRINT_TEXT]: (state, action) => {
        state = Object.assign({}, state, {
            result: action.payload
        });
        return state;
    }
}
```

* ___Actions index file___ ```no editing is needed```

```
export { printText } from './TestGroup/TestComponentActions.js';
```

* ___Reducers combination file___ ```no editing is needed```

```
import testComponentReducer from '../actions/TestGroup/TestComponentActions.js';
import { combineReducers } from 'redux';
const rootReducer = combineReducers({
    rootState: testComponentReducer
});
export default rootReducer;
```

----
#### Async action + ref to input element

* ___Meta___ 

```
"component": {
    ...
    "handlers": {
        "handleClick": "() => printText_async($inputText.getValue())"
    },
    "reducerRoot": "rootState"
    ...
}
"render": {
    ...
    "type": "Button",
    "props": {
        "onClick": "$handleClick"
    }
    ...
    "type": "Input",
    "props": {
        "ref": "inputText"
    }
    ...
}
```

* ___Component file___ 

```
...
handleClick() {
    const {dispatch} = this.props;
    const {inputText} = this.refs;
    dispatch(printText(inputText.getValue()));
}
...
render(){
    ...
    return (
        <Button onClick={this.handleClick}>...</Button>
        <Input ref="inputText" />
    )
    ...
}
...

```

* ___Actions file___ ```has to be edited after saving```

```
const PRINT_TEXT = 'PRINT_TEXT';

export const printText = createAction(PRINT_TEXT, inputText => {
    return Promise.resolve()
        .then(() => {
            return {};
    });
});

export default handleActions({
    [PRINT_TEXT]: {
        start(state, action) {
            ...
            return state;
        },
        next(state, action) {
            ...
            return state;
        },
        throw(state, action) {
            ...
            return state;
        }
    }
}
```

* ___Actions index file___ ```no editing is needed```

```
export { printText } from './TestGroup/TestComponentActions.js';
```

* ___Reducers combination file___ ```no editing is needed```

```
import testComponentReducer from '../actions/TestGroup/TestComponentActions.js';
import { combineReducers } from 'redux';
const rootReducer = combineReducers({
    rootState: testComponentReducer
});
export default rootReducer;
```

----
#### Existing action

* ___Meta___ 

```
"component": {
    ...
    "handlers": {
        "handleClick": "() => printText($inputText.getValue())"
    }
    ...
}
"render": {
    ...
    "type": "Button",
    "props": {
        "onClick": "$handleClick"
    }
    ...
    "type": "Input",
    "props": {
        "ref": "inputText"
    }
    ...
}
```

* ___Component file___ 

```
...
handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const {dispatch} = this.props;
    const {inputText} = this.refs;
    dispatch(printText(inputText.getValue()));
}
...
render(){
    ...
    return (
        <Button onClick={this.handleClick}>...</Button>
        <Input ref="inputText" />
    )
    ...
}
...

```

---
#### Specify state to props mapping as the destructuring assignment syntax

* ___Meta___
  
```
"component": {
    ...
    "stateToProps": "{ rootState: { domain1: { field1, field2 }, newDomain: { newField } } }"
    ...
}
...
```

* ___Component file___

```
...
function mapStateToProps(state) {
    const { rootState: { domain1: { field1, field2, newField }, newDomain: { newField2 } } } = state;
    return {
        field1,
        field2,
        newField
    };
}
...
```

* ___Initial state file___

```
export default {
    rootState: {
        domain1: {
            field1: 'Some existing value',
            field2: 'Another existing value',
            newField: null
        },
        newDomain: {
            newField2: null
        }
    }
};
```

----
#### Assign state props values to component (or child) props 

* ___Meta___
  
```
"component": {
    ...
    "stateToProps": "{ rootState: { domain1: { panelHeader, field2 }, newDomain: { newField } } }"
    ...
},
"render": {
    "type": "Panel",
    "props":{
        "header": "$panelHeader"
    }
}
```

* ___Component file___

```
...
render() {
    const { panelHeader, field2, newField } = this.props;
    return (<Panel header={panelHeader} >...</Panel>);
}
...
```

----
#### Extract component (or child) props as variables

* ___Meta___ ```BEFORE```
  
```
...
"render": {
    "type": "Panel",
    "props":{
        "header": "Panel Header",
        "style": {
            "width": "100%",
            "border": "1px solid #000000"
        }
    }
}
```

* ___Meta___ ```AFTER``` 
 
```
...
"render": {
    "type": "Panel",
    "props":{
        "header": "Panel Header",
        "style": "$panelStyle"
    }
}
```

* ___Component file___

```
...
render() {
    ...
    const panelStyle = {
        width: '100%',
        border: '1px solid #000000'
    };
    return (<Panel header="Panel Header" style={panelStyle} >...</Panel>);
}
...
```

-----
#### Extract component (or child) as a variable

* ___Meta___
  
```
...
"render": {
    "type": "Panel",
    "var": "panelVar"
}
```

* ___Component file___

```
...
render() {
    ...
    const panelVar = (<Panel>...</Panel>);
    return panelVar;
}
...
```

-----
#### Extract component (or child) in loop statement

* ___Meta___
  
```
...
"render": {
    "type": "Panel",
    "var": "panelVar_map"
}
```

* ___Component file___

```
...
render() {
    ...
    let panelVar_list = [1];
    let panelVar = panelVar_list.map( (item, index) => {
        return (<Panel key={index} >...</Panel>);
    });
    return panelVar;
}
...
```

-----
#### Extract component (or child) in loop statement traverse through one of the state props
* if propFromState is not specified in stateToProps expression new empty variable will be created.

* ___Meta___
  
```
...
"render": {
    "type": "Panel",
    "var": "panelVar_map$propFromState"
}
```

* ___Component file___

```
...
render() {
    ...
    let panelVar;
    if(propFromState && propFromState.length > 0){
        panelVar = propFromState.map( (item, index) => {
            return (<Panel key={index} >...</Panel>);
        })
    } else {
        panelVar = (<Panel>...</Panel>);
    }
    return panelVar;
}
...
```

-----
#### Extract component (or child) in if statement

* ___Meta___
  
```
...
"render": {
    "type": "Panel",
    "var": "panelVar_if"
}
```

* ___Component file___

```
...
render() {
    ...
    let panelVar = null;
    let panelVar_check = true;
    if(panelVar_check === true){
        panelVar = (<Panel key={index} >...</Panel>);
    }
    return panelVar;
}
...
```

-----
#### Extract component (or child) in if statement with one of the state props
* if propFromState is not specified in stateToProps expression new empty variable will be created.

* ___Meta___
  
```
...
"render": {
    "type": "Panel",
    "var": "panelVar_if$propFromState"
}
```

* ___Component file___

```
...
render() {
    ...
    let panelVar = null;
    if(propFromState === true){
        panelVar = (<Panel>...</Panel>);
    } else {
        panelVar = (<Panel>...</Panel>);
    }
    return panelVar;
}
...
```

