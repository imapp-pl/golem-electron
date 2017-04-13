import React from 'react';
import { Link } from 'react-router'
/**
 * @see http://react-component.github.io/tooltip/
 */
import ReactTooltip from 'rc-tooltip'

export default class Preview extends React.Component {


    constructor(props) {
        super(props);
    }

    /**
     * [_handleExpand new-window expand handler]
     */
    _handleExpand() {
        this.props.setPreviewExpanded(true)
    }

    render() {
        return (
            <div className="section__preview-black">
            <Link to="preview">
                <ReactTooltip placement="bottomRight" trigger={['hover']} overlay={<p>Preview Window</p>}>
                    <span className="button__expand icon-new-window" onClick={::this._handleExpand}></span>
                </ReactTooltip>
                </Link>
                <img src="https://golem.network/img/golem.png"/>
            </div>
        );
    }
}
