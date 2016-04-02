import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class PageForDesk extends Component{

    constructor(props, content) {
        super(props, content);
        this.handleViewVariant = this.handleViewVariant.bind(this);
    }

    handleViewVariant(e) {
        e.stopPropagation();
        e.preventDefault();
        const {initialState, componentInPreview} = this.props;
        if(initialState){
            initialState.setDefaultVariant(componentInPreview, e.currentTarget.dataset.key);
        }
    }

    render () {

        const {variantsInPreview, defaultVariantKey} = this.props;
        let variantButtons = [];
        if(variantsInPreview && variantsInPreview.length > 0){
            variantsInPreview.forEach((variantKey, index) => {
                variantButtons.push(
                    <div key={variantKey}
                         data-key={variantKey}
                         onClick={this.handleViewVariant}
                         title="Select this variant to preview"
                         className={"preview-overlay-variant-button" + (defaultVariantKey === variantKey ? " selected" : "")}>
                        {index + 1}
                    </div>
                )
            });
        }
        return (
            <div className="preview-overlay-container">
                <div className="preview-overlay-adjuster">
                    <div className="preview-overlay-box">
                        <div className="preview-overlay-canvas">
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <div className="preview-overlay-variant-toolbar">
                    {variantButtons}
                </div>
            </div>
        );
    }

}

export default PageForDesk;
