const admin = require('firebase-admin')
module.exports = ( workId, data ) => {
    return admin
        .firestore()
        .collection('work')
        .doc(workId)
        .update(data)
        .then(() => {
            console.log("Document successfully updated!")
            return
        })
        .catch((error) => {
            console.error("[OfferWork] Error updating work document: ", error)
        })
}
