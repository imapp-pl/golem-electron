import React from 'react';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../actions'

import Table from './Table'
import Preview from './Preview'
import Frame from './frame'
import DropZone from './../Dropzone'
import Modal from './../Modal'
import Footer from './../Footer'

const mapStateToProps = state => ({
    preview: state.input.preview,
    expandedPreview: state.input.expandedPreview
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

/**
 * { Class for TaskPanel component. }
 *
 * @class      TaskPanel (name)
 */
export class TaskPanel extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            deleteModal: false,
            deleteCallback: null
        }
    }


    componentDidMount() {
        const {actions} = this.props
        const endLoading = () => {
            actions.endLoading("TASK_PANEL_LOADER")
        /*Object.keys(require.cache).forEach(function(key) {
            delete require.cache[key]
        })*/
        }
        actions.startLoading("TASK_PANEL_LOADER", "I am loading!")
        setTimeout(endLoading, 3000)
    }

    _handleDeleteModal(deleteId, deleteCallback) {
        this.setState({
            deleteModal: true,
            deleteProps: {
                deleteId,
                deleteCallback
            },

        })
    }

    _closeDeleteModal() {
        this.setState({
            deleteModal: false
        })
    }


    render() {
        const {deleteModal, deleteProps} = this.state
        const {actions, preview, expandedPreview} = this.props

        return (
            <div className="content__task-panel">
                    <div className={`container__task-panel ${preview && 'container__task-panel--with-preview'}`}>
                        <DropZone>
                            <div className="section__table">
                                <Table deleteModalHandler={::this._handleDeleteModal}/>
                            </div>
                        </DropZone>
                        {preview && <div className="section__preview">
                             <Preview setPreviewExpanded={actions.setPreviewExpanded}/> 
                        </div>}
                        {deleteModal && <Modal type="delete" closeModal={::this._closeDeleteModal} {...deleteProps}/>}
                    </div>

                    <Footer {...this.props}/>
                </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskPanel)
