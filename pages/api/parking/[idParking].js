import { dataBaseFirestore } from "@/services/firebase"
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"

export default function handler(req, res) {
  const id = req.query.idParking

  if (req.method === 'GET') {
    getDoc(doc(dataBaseFirestore, 'parking/' + id)).then(snapshot => {
      let result = {id: id, ...snapshot.data()}
      res.status(200).json(result)
    })
  } else if (req.method === 'PUT') {
    const data = req.body

    return updateDoc(doc(dataBaseFirestore, 'parking/' + id), data).then(result => {
      return res.status(200).json(data)
    })
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}