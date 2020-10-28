import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import ApiContext from '../ApiContext';
import config from '../config';
import './App.css';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders});
            })
            .catch(error => {
                console.error({error});
            });
    }

    handleDeleteNote = note_id => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== note_id)
        });
    };

    addFolder = folder => {
        this.setState({
            folders: [...this.state.folders, folder]
        })
    }

    addNote = note => {
        this.setState({
            notes: [...this.state.notes, note]
        })
    }    

    renderNavRoutes() {
        return (
          <>
            {['/', '/folder/:folder_id'].map(path => 
              <Route
                exact
                key={path}
                path={path}
                component={NoteListNav}
              />
            )}
            <Route
              path='/note/:note_id'
              component={NotePageNav}
            />
            <Route
              path='/add-folder'
              component={NotePageNav}
            />
            <Route
              path='/add-note'
              component={NotePageNav}
            />
          </>
        )
      }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folder_id'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route path="/note/:note_id" component={NotePageMain} />
                <Route path='/add-note' component={AddNote} />
                <Route path='/add-folder' component={AddFolder} />
            </>
        );
    }

    render() {
        const contextValue = {
            notes: this.state.notes,
            folders: this.state.folders,
            addFolder: this.addFolder,
            addNote: this.addNote,
            deleteNote: this.handleDeleteNote,
    }
    
        return (            
                <ApiContext.Provider value={contextValue}>
                    <div className="App">
                        <nav className="App__nav">{this.renderNavRoutes()}</nav>
                        <header className="App__header">
                            <h1>
                                <Link to="/">Noteful</Link>{' '}
                                <FontAwesomeIcon icon="check-double" />
                            </h1>
                        </header>
                        <main className="App__main">{this.renderMainRoutes()}</main>
                    </div>
                </ApiContext.Provider>          
        );
    }
}

export default App;