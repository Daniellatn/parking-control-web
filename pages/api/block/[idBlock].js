import { dataBaseFirestore } from "@/services/firebase"
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"

export default function handler(req, res) {
  const id = req.query.idBlock

  if (req.method === 'GET') {
    getDoc(doc(dataBaseFirestore, 'block/' + id)).then(snapshot => {
      let result = {id: id, ...snapshot.data()}
      res.status(200).json(result)
    })
  } else if (req.method === 'PUT') {
    const data = req.body

    return updateDoc(doc(dataBaseFirestore, 'block/' + id), data).then(result => {
      return res.status(200).json(data)
    })
  } else if (req.method === 'DELETE') {
    return deleteDoc(doc(dataBaseFirestore, 'block', id)).then(result => {
      return res.status(200).json({ ok: true })
    })
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}