

export const findFolder = (folders=[], folderId) => 
    folders.find(folder => folder.id === folderId)

export const findNote =(notes=[], noteId) => 
    notes.find(note => {
        return note.id === noteId
    })

export const getNotesForFolder = (notes=[], folderId) => (
    (!folderId)
    ? notes
    : notes.filter(note => note.folderId === folderId)
)

export const countNotesForFolder = (notes=[], folderId) =>
    notes.filter(note => {
        return note.folderId === folderId
    }).length