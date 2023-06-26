import { dataBaseFirestore } from "@/services/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";


export default function handler(req, res) {
  if (req.method == 'GET') {
    getDocs(collection(dataBaseFirestore, 'apartment')).then((snapshot) => {
      let result = [];
      result = snapshot.docs.map((item) => {
        return { id: item.id, ...item.data() }
      })
      res.status(200).json(result)
    })
  } else if (req.method == 'POST') {
    let data = req.body
    addDoc(collection(dataBaseFirestore, 'apartment'), data).then((docRef) => {
      res.status(200).json({ id: docRef.id })
    })
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
