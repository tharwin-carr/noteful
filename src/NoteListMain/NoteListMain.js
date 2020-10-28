import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Note from '../Note/Note'
import CircleButton from '../CircleButton/CircleButton'
import ApiContext from '../ApiContext'
import './NoteListMain.css'

export default class NoteListMain extends React.Component {
  static defaultProps = {
    match: {
      params: {}
    }
  }
  static contextType = ApiContext

  render() {
      let notes = this.context.notes
      if (this.props.match.params.folder_id !== undefined) {
        notes = this.context.notes.filter(note => 
          note.folder_id === parseInt(this.props.match.params.folder_id)
        )
      }
      return (
      <section className='NoteListMain'>
        <ul>
          {notes.map(note =>
            <li key={note.id}>
              <Note
                id={note.id}
                title={note.title}
                modified={note.modified}
              />
            </li>
          )}
        </ul>
        <div className='NoteListMain__button-container'>
          <CircleButton
            tag={Link}
            to='/add-note'
            type='button'
            className='NoteListMain__add-note-button'
          >
            <FontAwesomeIcon icon='plus' />
            <br />
            Note
          </CircleButton>
        </div>
      </section>
    )
  }
}