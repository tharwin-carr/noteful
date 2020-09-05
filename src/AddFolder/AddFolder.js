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
            name: {
                value: '',
                touched: false
            }
        }
    }

    updateName(name) {
        this.setState({name: {value: name, touched: true}});
    }

    validateFolderName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
            return 'Folder name is required'
        } else if (name.length < 3) {
            return 'Folder name must be at least 3 characters long'
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const folder = {
            name: event.target.name.value
        }
        if (this.validateFolderName()) {
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
                        <label htmlFor='name'>Name</label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            onChange={e => {this.updateName(e.target.value)}}>
                        </input>
                        {this.state.name.touched && (
                            <ValidationError message={this.validateFolderName()} />
                        )}
                    </div>
                    <div>
                        <button type='submit' disabled={this.validateFolderName()}>
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
    name: PropTypes.string.isRequired
}