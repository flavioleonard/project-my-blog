import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  doc, getDoc, setDoc 
} from "firebase/firestore";

export const useFetchDocument = (docCollection, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function loadDocument() {
      if (cancelled) return;
      setLoading(true);
      
      try {
        const docRef = await doc(db, docCollection, id);
        const docSnap = await getDoc(docRef);

        setDocument(docSnap.data());
        setLoading(false);
        
      } catch (error) {
        console.log(error);
        setError(error.message)

        setLoading(false);

      }

      
    }
    loadDocument();
  }, [docCollection, id]); //se tiver uma coleção, busca, uid de um usuario posso buscar dados e se chegar o cancelado eu paro de buscar dados
  useEffect(() => {
    return setCancelled(true);
  }, []);

  return { document, loading, error };
};
