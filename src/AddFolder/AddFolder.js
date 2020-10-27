import React, { Component } from 'react'
import ValidationError from '../ValidationError'
import ApiContext from '../ApiContext'
import ErrorBoundary from '../ErrorBoundary'
import NotefulForm from '../NotefulForm/NotefulForm'
import config from '../config'
import PropTypes from 'prop-types'

export default class AddFolder extends Component {
    static contextType= ApiContext;
    constructor(props) {
        super(props);
        this.state= {
            title: {
                value: '',
                touched: false
            }
        }
    }

    updateTitle(title) {
        this.setState({title: {value: title, touched: true}});
    }

    validateFolderTitle() {
        const title = this.state.title.value.trim();
        if (title.length === 0) {
            return 'Folder title is required'
        } else if (title.length < 3) {
            return 'Folder title must be at least 3 characters long'
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const folder = {
            title: event.target['title-section'].value
        }
        if (this.validateFolderTitle()) {
            return 
        }
        fetch(`${config.API_ENDPOINT}/folders`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(folder)
        } 
        )
        .then(res => res.json())
        .then(newFolder => {
            this.context.addFolder(newFolder)
            this.props.history.push('/')
        })
        .catch(e => this.setState({
            error: 'Something went wrong. Please try again.'
        }))
    }

    render() {
        return (
            <ErrorBoundary>
                <NotefulForm onSubmit={e => this.handleSubmit(e)}>
                    <h2>Create a Folder</h2>
                    <div>
                        <label htmlFor='title'>Title</label>
                        <input
                            type='text'
                            name='title-section'
                            id='title'
                            onChange={e => {this.updateTitle(e.target.value)}}>
                        </input>
                        {this.state.title.touched && (
                            <ValidationError message={this.validateFolderTitle()} />
                        )}
                    </div>
                    <div>
                        <button type='submit' disabled={this.validateFolderTitle()}>
                            Add Folder
                        </button>
                    </div>
                </NotefulForm>
            </ErrorBoundary>
        )
    }
}

AddFolder.propTypes = {
    history: PropTypes.object,
    title: PropTypes.string
}