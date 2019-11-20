const { ApolloError, ValidationError } = require('apollo-server-express')
const objectAssignDeep = require('object-assign-deep')
const admin = require('firebase-admin')
const getImagesByWorkIdArr = require('../lib/getImagesByWorkIdArr')
module.exports = async (_, args) => {
    try {
        const works = await admin
            .firestore()
            .collection('work')
            .where('ownerId', '==', args.userId)
            .get()
            .then(querySnapshot => {
                if (querySnapshot) {
                    const results = []
                    querySnapshot.forEach((doc) => {
                        const docId = doc.id
                        const docData = doc.data()
                        // doc.data() is never undefined for query doc snapshots
                        results.push(objectAssignDeep({}, { id: docId }, docData))
                    });
                    return results
                }
                else {
                    return new ValidationError('[getWorksByUserId] Documents do not exist')
                }
            })
            .catch(err => console.log('Error getting document', err));

        const images = await getImagesByWorkIdArr(works)
        // this is NOT ideal
        // the NEW response is a merge of the two
        // im not into this at all...will have to come back later to look into a better solution
        return works.map((item, index) => objectAssignDeep({}, item, { url: images[index] }))
    } catch (error) {
        throw new ApolloError(`Resolver Query getWorksByUserId() ${error}`);
    }
}