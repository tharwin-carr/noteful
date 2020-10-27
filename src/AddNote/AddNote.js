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
      notetitle: {
        value: "",
        touched: false
      },
      noteContext: {
        value:"",
        touched: false
      }
    }

  updateNotetitle(notetitle) {
    this.setState({
      notetitle: {
        value: notetitle,
        touched: true
      }
    });
  }

  validateNotetitle() {
    const notetitle = this.state.notetitle.value.trim();
    if (notetitle.length === 0) {
      return "Note title is required";
    } else if (notetitle.length < 3) {
      return "Note title must be at least 3 characters long"
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
      title: e.target['title-section'].value,
      content: e.target['content'].value,
      folder_id: e.target['folder-select'].value,
      modified: new Date(),
    }
    if (this.validateNotetitle()) {
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
                        <label htmlFor='title'>Title</label>
                        <input 
                            type='text'
                            name='title-section'
                            id='title'
                            onChange= {e => this.updateNotetitle(e.target.value)}
                        />
                        {this.state.notetitle.touched && <ValidationError message={this.validateNotetitle()} />}
                        <label htmlFor='content'>Content</label>
                        <textarea 
                            onChange={e => this.updateNoteContext(e.target.value)}
                            name='content'>
                            </textarea>
                        <label htmlFor='folder-select'>Folder</label>
                        <select name='folder-select'>
                        {this.context.folders.map(folder => (
                        <option key={folder.id} value={folder.id}>{folder.title}</option>
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
    title: PropTypes.string,
    content: PropTypes.string,
    folder_id: PropTypes.number,
    modified: PropTypes.number
    }