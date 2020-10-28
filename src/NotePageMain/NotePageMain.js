import React from 'react'
import Note from '../Note/Note'
import ApiContext from '../ApiContext'
import './NotePageMain.css'

export default class NotePageMain extends React.Component {
  static defaultProps = {
    match: {
      params: {}
    }
  }
  static contextType = ApiContext

  handleDeleteNote = () => {
    this.props.history.push(`/`)
  }

  render() {
    let notes = this.context.notes.filter(note =>
      note.id === parseInt(this.props.match.params.note_id)
      )

    return notes.map(note => {
        return (
          <section className='NotePageMain'>
            <Note
              id={note.id}
              title={note.title}
              modified={note.modified}
              onDeleteNote={this.handleDeleteNote}
            />
            <div className='NotePageMain__content'>
              <p>{note.content}</p>
            </div>
          </section>
        )
      })
    }
    }
