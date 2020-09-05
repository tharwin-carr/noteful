import React, { Component } from 'react'
import ApiContext from '../ApiContext'
import ValidationError from '../ValidationError'
import PropTypes from 'prop-types'
import ErrorBoundary from '../ErrorBoundary'
import config from '../config'
import NotefulForm from '../NotefulForm/NotefulForm'

export default class AddNote extends Component {
    static contextType = ApiContext

    state = {
      noteName: {
        value: "",
        touched: false
      },
      noteContext: {
        value:"",
        touched: false
      }
    }

  updateNoteName(noteName) {
    this.setState({
      noteName: {
        value: noteName,
        touched: true
      }
    });
  }

  validateNoteName() {
    const noteName = this.state.noteName.value.trim();
    if (noteName.length === 0) {
      return "Note name is required";
    } else if (noteName.length < 3) {
      return "Note name must be at least 3 characters long"
    }
  }

  updateNoteContext(noteContext) {
    this.setState({
      noteContext: {
        value: noteContext,
        touched: true
      }
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const note = {
      name: e.target.name.value,
      content: e.target.content.value,
      folderId: e.target.folderId.value,
      modified: new Date(),
    }
    if (this.validateNoteName()) {
      return
    }
    fetch(
      `${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(note)
    }
    )
      .then(res => res.json())
      .then(newNote => {
        this.context.addNote(newNote)
        this.props.history.push("/")
      })
      .catch(e => this.setState({
        error:"Something happened when creating note, try again."
      }))
  }

    render() {
        return (
            <ErrorBoundary>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <h2>Create a Note</h2>
                    <div>
                        <label htmlFor='name'>Name</label>
                        <input 
                            type='text'
                            name='name'
                            id='name'
                            onChange= {e => this.updateNoteName(e.target.value)}
                        />
                        {this.state.noteName.touched && <ValidationError message={this.validateNoteName()} />}
                        <label htmlFor='content'>Content</label>
                        <textarea 
                            onChange={e => this.updateNoteContext(e.target.value)}
                            name='content'>
                            </textarea>
                        <label htmlFor='folderId'>Folder</label>
                        <select name='folderId'>
                        {this.context.folders.map(folder => (
                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                        ))}
                        </select>
                        <button type='submit'>
                            Add note
                        </button>
                    </div>
                </NotefulForm>
            </ErrorBoundary>
        )
    }
}


AddNote.propTypes = {
    history: PropTypes.object,
    name: PropTypes.string.isRequired,
    content: PropTypes.string,
    folderId: PropTypes.number,
    modified: PropTypes.number
    }