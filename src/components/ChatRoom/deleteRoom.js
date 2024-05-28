
import { db } from '../lib/firebaseConfig';
import { collection, doc, deleteDoc } from "firebase/firestore";

// Hàm xóa một tài liệu từ Firestore
async function deleteRoom(collectionName, documentId) {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    console.log('Document deleted successfully.');
  } catch (error) {
    console.error('Error deleting document:', error);
  }
}

export default deleteRoom;