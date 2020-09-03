import React, { Component } from 'react'
import ApiContext from './ApiContext'
import NotefulForm from './NotefulForm/NotefulForm'

export class AddFolder extends Component {
    static defaultProps = {
        history: {
            push: () => { },
        } 
    }

    static contextType= ApiContext;

    handleSubmit(event) {
        event.preventDefault();
        const folder = {
            name: e.target['folder-section'].value
        }
        fetch(`${config.API_ENDPOINT}/folders`, {
            method: 'POST',
            body: JSON.stringify(folder),
            headers: {
                'content-type': 'application/json',
            }
        })
        .then(res => {
            if (!res.ok) 
                return res.json().then(e => Promise.reject(e))
            return res.json            
        })
        .then(folder => {
            this.context.addFolder(folder)
            this.props.history.push('/')
        })
        .catch(error => {
            console.error({error});
        })
    }

    render() {
        return (
           <div className='AddFolder'>
               <h2>Create a Folder</h2>
               <NotefulForm onSubmit={this.handleSubmit}>
                   <div>
                       <label htmlFor='name'>
                           Name
                       </label>
                       <input
                        type='text'
                        id='name'
                        name= 'folder-section'
                        />                    
                   </div>
                   <div className='AddFolder__button'>
                       <button type='submit'>
                           Add Folder
                       </button>
                   </div>
               </NotefulForm>
           </div>
        )
    }
}

AddFolder.propTypes= {
    name: PropTypes.string
}

export default AddFolder
